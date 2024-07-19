import { DessertComponents, Direction } from '../entities/types';
import { EventType, StepData, System } from '../engine/types';
import { EntityProvider } from '../engine/world/types';
import BaseScene from '../scenes/BaseScene';
import PHYSICS_CONSTANTS from '../utils/physicsConstants';
import MessageBus from '../messageBus/MessageBus';

export class MovementSystem implements System {
	private gravity: number = PHYSICS_CONSTANTS.GRAVITY;
	constructor(
		private world: EntityProvider<DessertComponents>,
		private scene: BaseScene
	) {}

	private calculateDownwardVelocity(initialVelocity: number, delta: number) {
		const newVelocity = initialVelocity + this.gravity * delta;
		return Math.min(newVelocity, PHYSICS_CONSTANTS.MAX_DOWNWARD_VELOCITY);
	}

	step({ delta }: StepData) {
		this.world.entities.forEach(({ id, movement, collision, render, facing }) => {
			if (render) {
				const sprite = render.sprite;
				if (sprite) {
					if (movement?.hasGravity) {
						sprite.body.velocity.y = this.calculateDownwardVelocity(sprite.body.velocity.y, delta);
					}

					if (collision) {
						collision.blocked = { ...sprite.body.blocked };
					}

					if (facing) {
						if (sprite.body.velocity.x > 0) {
							facing.direction = Direction.RIGHT;
						} else if (sprite.body.velocity.x < 0) {
							facing.direction = Direction.LEFT;
						}
					}

					// delete the entity if it's way off screen
					if (
						sprite.y > this.scene.game.canvas.height + 100 ||
						sprite.y < -100 ||
						sprite.x > this.scene.game.canvas.width + 100 ||
						sprite.x < -100
					) {
						MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
					}
				}
			}
		});
	}
}
