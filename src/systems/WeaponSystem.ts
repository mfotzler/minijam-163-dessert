import { System, EventType } from "../engine/types";
import { FrostingShot, Weapons } from "../entities/Weapons";
import MessageBus from "../messageBus/MessageBus";
import { World } from "../world";

export class WeaponSystem implements System {
    constructor(private world: World) {
        MessageBus.subscribe(EventType.PLAYER_SHOOT, ({ mousePos }) => {
            const playerEntity = world.entityProvider.getEntity(world.playerId);
            const { player: playerData, render } = playerEntity;

            if (playerData.shotCooldown > 0) {
                return;
            }

            const weapon = Weapons[playerData.currentWeapon];

            playerData.shotCooldown = FrostingShot.projectile.cooldown;

            const currentlyAlive = world.entityProvider.entities.filter(e => e.projectile?.type === playerData.currentWeapon).length;
            if (currentlyAlive >= 5) {
                return;
            }

            const velocityDirection = {
                x: mousePos.x - (render?.sprite?.x ?? 0),
                y: mousePos.y - (render?.sprite?.y ?? 0),
            };
            const magnitude = Math.sqrt(velocityDirection.x ** 2 + velocityDirection.y ** 2);
            const initialVelocity = {
                x: velocityDirection.x / magnitude * FrostingShot.projectile.speed,
                y: velocityDirection.y / magnitude * FrostingShot.projectile.speed,
            };

            world.createEntity({
                    ...weapon,
                    movement: {
                        ...weapon.movement,
                        initialVelocity,
                    }
                },
                { x: render?.sprite?.x ?? 0, y: render?.sprite?.y ?? 0 });
        })
    }

    step() {
        const playerEntity = this.world.entityProvider.getEntity(this.world.playerId);
        playerEntity.player.shotCooldown = Math.max(0, playerEntity.player.shotCooldown - 1);
    }
};