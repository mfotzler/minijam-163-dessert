import { EventType, System } from '../engine/types';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';
import MessageBus from '../messageBus/MessageBus';
import * as Phaser from 'phaser';

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

				const playerSprite = player.render.sprite;
				const playerBoundingBox = playerSprite.getBounds();
				const entitySprite = entity.render.sprite;
				const entityBoundingBox = entitySprite.getBounds();

				// if the player is touching the entity, send a message
				const isOverlapping = Phaser.Geom.Intersects.RectangleToRectangle(
					playerBoundingBox,
					entityBoundingBox
				);

				if (isOverlapping) {
					MessageBus.sendMessage(EventType.PLAYER_COLLISION, { id: entity.id });
					if (entity.movement?.killOnCollision) {
						MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: entity.id });
					}
				}
			}
		});
	}
}
