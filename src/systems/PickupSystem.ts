import { System, EventType } from "../engine/types";
import MessageBus from "../messageBus/MessageBus";
import { World } from "../world";

export class PickupSystem implements System {
    constructor(world: World) {
        MessageBus.subscribe(EventType.PLAYER_COLLISION, ({ id }) => {
            const playerEntity = world.entityProvider.getEntity(world.playerId);
            const pickupEntity = world.entityProvider.getEntity(id);
            if (!playerEntity?.player || !pickupEntity?.weaponPickup) return;

            playerEntity.player.currentWeapon = pickupEntity.weaponPickup.weaponType;

            // play ridiculous sound effects here

            MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
        });
    }

    step() {}
}