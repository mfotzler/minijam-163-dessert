import { EventType, StepData, System } from '../engine/types';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';
import MessageBus from '../messageBus/MessageBus';

export class CollisionSystem implements System {
	constructor(
		scene: BaseScene,
		private world: World
	) {
		MessageBus.subscribe(
			EventType.ENTITY_ADDED,
			({ id, entitySprite }: { id: string; entitySprite: Phaser.GameObjects.Sprite }) => {
				const entity = world.entityProvider.getEntity(id);
				if (!entity.collision) return;

				if (entity.collision.tiles) {
					scene.physics.add.existing(entitySprite);
					scene.physics.add.collider(entitySprite, world.wallLayer);
				}
			}
		);
	}

	step() {
		// pickup collision going here so it doesn't rely on the player sprite existing at setup time
		this.world.entityProvider.entities.forEach((entity) => {
			if (entity.collision?.player && entity.render?.sprite) {
				const player = this.world.entityProvider.getEntity(this.world.playerId);
				if (!player?.render?.sprite) return;

				// get distance between player sprite and entity
				const dx = entity.render.sprite.x - player.render.sprite.x;
				const dy = entity.render.sprite.y - player.render.sprite.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < 32) {
					MessageBus.sendMessage(EventType.PLAYER_COLLISION, { id: entity.id });
				}
			}
		});
	}
}
