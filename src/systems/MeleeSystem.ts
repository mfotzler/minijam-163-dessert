import { EventType, System } from '../engine/types';
import { World } from '../world';
import MessageBus from '../messageBus/MessageBus';
import { Weapons } from '../entities/Weapons';
import { Direction } from '../entities/types';

export class MeleeSystem implements System {
	private static readonly MELEE_COOLDOWN = 30;

	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_MELEE, () => {
			const playerEntity = world.entityProvider.getEntity(world.playerId);
			const { player: playerData, render, facing } = playerEntity;

			if (playerData.shotCooldown > 0) {
				return;
			}

			const weapon = Weapons['rolling-pin'];

			playerData.shotCooldown = weapon.projectile.cooldown;

			const currentlyAlive = world.entityProvider.entities.filter(
				(e) => e.projectile?.type === Weapons['rolling-pin'].projectile.type
			).length;
			if (currentlyAlive >= 1) {
				return;
			}

			const initialVelocity = {
				x: 0,
				y: 0
			};

			const direction = facing?.direction ?? Direction.RIGHT;

			world.createEntity(
				{
					...weapon,
					movement: {
						...weapon.movement,
						initialVelocity,
						rotation: {
							...weapon.movement.rotation,
							velocity: this.getWeaponRotation(direction, weapon.movement.rotation.velocity)
						}
					}
				},
				{ x: this.getWeaponX(direction, render?.sprite?.x ?? 0), y: render?.sprite?.y + 3 ?? 3 }
			);
		});
	}

	private getWeaponRotation(facing: Direction, velocity: number = 240) {
		return facing === Direction.RIGHT ? velocity : -velocity;
	}

	private getWeaponX(facing: Direction, initialX: number): number {
		const offset = 45;

		return facing === Direction.RIGHT ? initialX + offset : initialX - offset;
	}

	step() {}
}
