import { System, EventType } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';

export class PickupSystem implements System {
	constructor(
		private scene: BaseScene,
		world: World
	) {
		MessageBus.subscribe(EventType.PLAYER_COLLISION, ({ id }) => {
			const playerEntity = world.entityProvider.getEntity(world.playerId);
			const pickupEntity = world.entityProvider.getEntity(id);
			if (!playerEntity?.player || !pickupEntity?.weaponPickup) return;

			const { weaponType } = pickupEntity.weaponPickup;
			playerEntity.player.currentWeapon = weaponType;

			MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'weapon-pickup' });
			MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, {
				key: `get-${weaponType}`,
				delay: 0.25
			});

			MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
		});
	}

	step() {}
}
