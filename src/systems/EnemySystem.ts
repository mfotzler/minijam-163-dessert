import { EntityDefinition } from '../engine/entities/types';
import { EventType, System } from '../engine/types';
import { Pea } from '../entities/Enemies';
import { DessertComponents } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';
import { cloneDeep } from 'lodash';
import { GameStateSystem } from './GameStateSystem';

export class EnemySystem implements System {
	static readonly CARROT_SHOOTING_RANGE = 300;
	static readonly CARROT_SHOT_COOLDOWN_EASY = 120;
	static readonly CARROT_SHOT_COOLDOWN_HARD = 60;
	static readonly CARROT_SHOT_SPEED = 200;

	constructor(
		scene: BaseScene,
		private world: World
	) {
		MessageBus.subscribe(EventType.PLAYER_COLLISION, ({ id }) => {
			const playerEntity = world.entityProvider.getEntity(world.playerId);
			const enemyEntity = world.entityProvider.getEntity(id);
			if (!playerEntity?.player || !enemyEntity?.enemy) return;

			MessageBus.sendMessage(EventType.PLAYER_DAMAGE, { damage: enemyEntity.enemy.damage });
		});

		MessageBus.subscribe(EventType.PROJECTILE_COLLISION, ({ id, damage }) => {
			const enemyEntity = world.entityProvider.getEntity(id);

			if (!enemyEntity?.enemy || enemyEntity.enemy.iframes > 0) return;

			enemyEntity.enemy.health = (enemyEntity.enemy.health ?? 1) - damage;
			enemyEntity.enemy.iframes = 20;
			// add flashing
			enemyEntity.render?.sprite?.setTintFill(0xffffff);
			for (let i = 1; i <= 5; i++) {
				scene.time.delayedCall(i * 50, () => {
					if (i % 2 === 0) {
						enemyEntity.render?.sprite?.setTintFill(0xffffff);
					} else {
						enemyEntity.render?.sprite?.clearTint();
					}
				});
			}

			if (enemyEntity.enemy.health <= 0) {
				MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
				MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_2' });
			} else {
				MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hurt_1' });
			}
		});
	}

	step() {
		this.world.entityProvider.entities.forEach((entity) => {
			if (entity.enemy) {
				if (entity.collision.blocked?.down) {
					entity.render?.sprite?.setVelocityX(0);
				}
				if (entity.enemy.type) {
					enemyBehaviors[entity.enemy.type]?.(this.world, entity);
				}
				entity.enemy.iframes = Math.max(0, (entity.enemy.iframes ?? 0) - 1);
			}
		});
	}
}

const enemyBehaviors = {
	asparatato: (world: World, entity: EntityDefinition<DessertComponents>) => {
		const { enemy, render } = entity;
		if (!enemy || !render?.sprite) return;

		const seconds = Math.floor((enemy.stateTime ?? 0) / 60);
		const direction = (seconds % 2) * 2 - 1;
		render.sprite.setVelocityX(direction * -100);

		if (enemy.stateTime % 30 === 0) {
			world.createEntity(Pea, {
				x: render.sprite.x,
				y: render.sprite.y + 50
			});
		}

		enemy.stateTime = (enemy.stateTime ?? 0) + 1;
	},
	brussel: (world: World, entity: EntityDefinition<DessertComponents>) => {
		const { collision, render, enemy } = entity;
		if (!collision || !render?.sprite) return;

		if (collision.blocked?.down && enemy?.stateTime <= 0) {
			render.sprite.setVelocityY(-800);
			enemy.stateTime = Math.random() * 180;
		}

		enemy.stateTime = (enemy.stateTime ?? 1) - 1;
	},
	carrot: (world: World, entity: EntityDefinition<DessertComponents>) => {
		const { collision, render, enemy } = entity;
		const currentLevel = GameStateSystem.state.level;

		if (currentLevel === 0) {
			return;
		}

		const player = world.entityProvider.getEntity(world.playerId);

		if (!collision || !render?.sprite || !player) return;

		const distanceFromPlayerX = player?.render?.sprite?.x - render?.sprite?.x;
		const distanceFromPlayerY = player?.render?.sprite?.y - render?.sprite?.y;

		const totalDistance = Math.sqrt(distanceFromPlayerX ** 2 + distanceFromPlayerY ** 2);
		const cooldown = enemy?.shotCooldown ?? 0;

		if (cooldown > 0) {
			entity.enemy.shotCooldown = cooldown - 1;
			return;
		}

		if (totalDistance < EnemySystem.CARROT_SHOOTING_RANGE) {
			const angle = Math.atan2(distanceFromPlayerY, distanceFromPlayerX);
			const velocity = EnemySystem.CARROT_SHOT_SPEED;

			const peaClone = cloneDeep(Pea);

			peaClone.movement.initialVelocity = {
				x: Math.cos(angle) * velocity,
				y: Math.sin(angle) * velocity
			};

			world.createEntity(peaClone, {
				x: render?.sprite?.x,
				y: render?.sprite?.y
			});

			entity.enemy.shotCooldown =
				currentLevel === 1
					? EnemySystem.CARROT_SHOT_COOLDOWN_EASY
					: EnemySystem.CARROT_SHOT_COOLDOWN_HARD;
		}
	}
};
