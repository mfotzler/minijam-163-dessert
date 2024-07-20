import { EventType, System } from '../engine/types';
import BaseScene from '../scenes/BaseScene';
import MessageBus from '../messageBus/MessageBus';

export type SoundEffectOptions = {
	key: string;
	delay?: number;
};

export class SoundEffectSystem implements System {
	private sfx: Record<string, Phaser.Sound.BaseSound> = {};

	constructor(private scene: BaseScene) {
		MessageBus.subscribe(EventType.SOUND_EFFECT_PLAY, this.playSoundEffect.bind(this));
	}

	playSoundEffect(options: SoundEffectOptions) {
		let sfx = this.getSfx(options.key);

		if (sfx) {
			sfx.play({ delay: options.delay || 0 });
		}
	}
	private getSfx(key: string) {
		if (!this.sfx[key]) {
			this.sfx[key] = this.scene.sound.add(key);
		}
		return this.sfx[key];
	}
	step(data) {}
}
