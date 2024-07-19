import { System, StepData, EventType } from "../engine/types";
import { FrostingShot } from "../entities/FrostingShot";
import { Direction } from "../entities/types";
import MessageBus from "../messageBus/MessageBus";
import { World } from "../world";

export class WeaponSystem implements System {
    private nextShotTicks = 0;

    constructor(world: World) {
        MessageBus.subscribe(EventType.PLAYER_SHOOT, ({ mousePos }) => {
            if (this.nextShotTicks > 0) {
                return;
            }

            this.nextShotTicks = FrostingShot.projectile.cooldown;
            const player = world.entityProvider.getEntity(world.playerId);

            const currentlyAlive = world.entityProvider.entities.filter(e => e.projectile?.type === 'frosting').length;
            if (currentlyAlive >= 5) {
                return;
            }

            const velocityDirection = {
                x: mousePos.x - (player.render?.sprite?.x ?? 0),
                y: mousePos.y - (player.render?.sprite?.y ?? 0),
            };
            const magnitude = Math.sqrt(velocityDirection.x ** 2 + velocityDirection.y ** 2);
            const initialVelocity = {
                x: velocityDirection.x / magnitude * FrostingShot.projectile.speed,
                y: velocityDirection.y / magnitude * FrostingShot.projectile.speed,
            };

            world.createEntity({
                    ...FrostingShot,
                    movement: {
                        ...FrostingShot.movement,
                        initialVelocity,
                    }
                },
                { x: player.render?.sprite?.x ?? 0, y: player.render?.sprite?.y ?? 0 });
        })
    }

    step() {
        if (this.nextShotTicks > 0) {
            this.nextShotTicks--;
        }
    }
};
