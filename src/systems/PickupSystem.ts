import { System, EventType } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';

export class PickupSystem implements System {
	private sfx: Record<string, Phaser.Sound.BaseSound> = {};

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

			this.getSfx('weapon-pickup')?.play();
			this.getSfx(`get-${weaponType}`)?.play({ delay: 0.25 });

			MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
		});
	}

	step() {}

	private getSfx(key: string) {
		if (!this.sfx[key]) {
			this.sfx[key] = this.scene.sound.add(key);
		}
		return this.sfx[key];
	}
}
