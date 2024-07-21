import { System, EventType } from '../engine/types';
import { WeaponType, Weapons } from '../entities/Weapons';
import { DessertComponents, Direction } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import { World } from '../world';

export class WeaponSystem implements System {
	constructor(private world: World) {
		MessageBus.subscribe(EventType.PLAYER_SHOOT, ({ mousePos }) => {
			const playerEntity = world.entityProvider.getEntity(world.playerId);
			const { player: playerData } = playerEntity;

			if (playerData.shotCooldown > 0) {
				return;
			}

			const weapon = Weapons[playerData.currentWeapon];

			playerData.shotCooldown = weapon.projectile.cooldown;

			const currentlyAlive = world.entityProvider.entities.filter(
				(e) => e.projectile?.type === playerData.currentWeapon
			).length;
			if (currentlyAlive >= 5) {
				return;
			}

			weaponBehaviors[playerData.currentWeapon]?.(mousePos, world, playerEntity);
		});
	}

	step() {
		const playerEntity = this.world.entityProvider.getEntity(this.world.playerId);
		if (!playerEntity?.player) return;
		playerEntity.player.shotCooldown = Math.max(0, playerEntity.player.shotCooldown - 1);
	}
}

const weaponBehaviors = {
	frosting: (mousePos: { x: number; y: number }, world: World, playerEntity: DessertComponents) => {
		const { render } = playerEntity;
		const weapon = Weapons.frosting;
		const velocityDirection = {
			x: mousePos.x - (render?.sprite?.x ?? 0),
			y: mousePos.y - (render?.sprite?.y ?? 0)
		};
		const magnitude = Math.sqrt(velocityDirection.x ** 2 + velocityDirection.y ** 2);
		const initialVelocity = {
			x: (velocityDirection.x / magnitude) * weapon.projectile.speed,
			y: (velocityDirection.y / magnitude) * weapon.projectile.speed
		};

		world.createEntity(
			{
				...weapon,
				movement: {
					...weapon.movement,
					initialVelocity
				}
			},
			{ x: (render?.sprite?.x ?? 0) + Math.sign(initialVelocity.x) * 50, y: render?.sprite?.y ?? 0 }
		);
	},
	sprinkle: (_, world: World, playerEntity: DessertComponents) => {
		const { render, facing } = playerEntity;
		const weapon = Weapons.sprinkle;

		const sign = facing?.direction === Direction.LEFT ? -1 : 1;

		for (let i = -1; i <= 1; i++) {
			const angle = (i * 30 * Math.PI) / 180;
			const { speed } = weapon.projectile;
			const initialVelocity = {
				x: Math.cos(angle) * speed * sign,
				y: Math.sin(angle) * speed
			};

			world.createEntity(
				{
					...weapon,
					movement: {
						...weapon.movement,
						initialVelocity
					}
				},
				{ x: (render?.sprite?.x ?? 0) + sign * 50, y: render?.sprite?.y ?? 0 }
			);
		}
	}
};
