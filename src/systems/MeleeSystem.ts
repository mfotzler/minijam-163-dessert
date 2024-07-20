import { EventType, System } from '../engine/types';
import { World } from '../world';
import MessageBus from '../messageBus/MessageBus';
import { Weapons } from '../entities/Weapons';

export class MeleeSystem implements System {
	private static readonly MELEE_COOLDOWN = 30;

	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_MELEE, (facing: 'left' | 'right') => {
			const playerEntity = world.entityProvider.getEntity(world.playerId);
			const { player: playerData, render } = playerEntity;

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

			world.createEntity(
				{
					...weapon,
					movement: {
						...weapon.movement,
						initialVelocity,
						rotation: { velocity: this.getWeaponRotation(facing) }
					}
				},
				{ x: this.getWeaponX(facing, render?.sprite?.x ?? 0), y: render?.sprite?.y + 3 ?? 3 }
			);
		});
	}

	private getWeaponRotation(facing: 'left' | 'right') {
		return facing === 'right' ? 90 : -90;
	}

	private getWeaponX(facing: 'left' | 'right', initialX: number): number {
		const offset = 45;

		return facing === 'right' ? initialX + offset : initialX - offset;
	}

	step() {}
}
