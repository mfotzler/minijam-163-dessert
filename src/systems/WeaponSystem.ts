import { System, StepData, EventType } from "../engine/types";
import { FrostingShot } from "../entities/FrostingShot";
import { Direction } from "../entities/types";
import MessageBus from "../messageBus/MessageBus";
import { World } from "../world";

export class WeaponSystem implements System {
    constructor(world: World) {
        MessageBus.subscribe(EventType.PLAYER_SHOOT, () => {
            const player = world.entityProvider.getEntity(world.playerId);
            world.createEntity({
                    ...FrostingShot,
                    movement: {
                        ...FrostingShot.movement,
                        initialSpeed: { x: player.facing?.direction === Direction.RIGHT ? 500 : -500, y: 0 },
                    }
                },
                { x: player.render?.sprite?.x ?? 0, y: player.render?.sprite?.y ?? 0 });
        })
    }

    step() {}
};
