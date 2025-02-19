import { EventType, StepData, System } from '../engine/types';
import { DessertComponents, Direction, RenderComponent } from '../entities/types';
import { EntityCollection } from '../engine/world';
import BaseScene from '../scenes/BaseScene';
import { EntityDefinition } from '../engine/entities/types';
import MessageBus from '../messageBus/MessageBus';

export default class RenderSystem implements System {
	private sprites: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};

	constructor(
		private scene: BaseScene,
		private entityProvider: EntityCollection<DessertComponents>
	) {
		MessageBus.subscribe(
			EventType.ADD_ENTITY,
			({ entity }: { entity: EntityDefinition<DessertComponents> }) => {
				const { id, position, movement, render, projectile } = entity;
				if (!this.sprites[id] && render) {
					const entitySprite = this.createSprite(render);
					entitySprite.setPosition(position?.x ?? 0, position?.y ?? 0);

					if (render.followWithCamera) scene.cameras.main.startFollow(entitySprite);

					if (movement?.initialVelocity) {
						entitySprite.setVelocity(movement.initialVelocity.x, movement.initialVelocity.y);
					}

					if (movement?.rotation?.startAngle) {
						entitySprite.setAngle(movement.rotation.startAngle);
					}

					if (movement?.rotation?.velocity) {
						entitySprite.setAngularVelocity(movement.rotation.velocity);
					}

					if (movement?.rotation?.origin) {
						entitySprite.setOrigin(movement.rotation.origin.x, movement.rotation.origin.y);
					}

					this.sprites[id] = entitySprite;

					MessageBus.sendMessage(EventType.ENTITY_ADDED, { id, entitySprite, entity });

					if (projectile?.lifetime) {
						scene.time.delayedCall(projectile.lifetime, () => {
							MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
						});
					}
				}
			}
		);

		MessageBus.subscribe(EventType.ENTITY_DELETED, ({ entityId: id }) => {
			const entitySprite = this.sprites[id];
			if (entitySprite) {
				entitySprite.destroy();
				delete this.sprites[id];
			}
		});
	}

	private createSprite(render: RenderComponent): Phaser.Physics.Arcade.Sprite {
		return this.scene.physics.add
			.sprite(0, 0, render.spriteSheet ?? 'textures', render.spriteKey)
			.setScale(render.scale ?? 1);
	}

	step({}: StepData) {
		this.entityProvider.entities.forEach((entity) => {
			const { render, position, facing } = entity;

			if (render && position) {
				this.ensureEntityHasSprite(entity.id, render);
				if (render.currentAnimation) {
					this.sprites[entity.id].anims.play(render.currentAnimation, true);
				} else {
					this.sprites[entity.id].anims.stop();
				}

				if (facing) {
					this.sprites[entity.id].setFlipX(facing.direction === Direction.LEFT);
				}
			}
		});
	}

	private ensureEntityHasSprite(entityId: string, render: RenderComponent) {
		if (!this.sprites[entityId]) {
			this.sprites[entityId] = this.createSprite(render);
		}
		if (!render.sprite) {
			render.sprite = this.sprites[entityId];
		}
	}
}
