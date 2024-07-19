import * as Phaser from 'phaser';

import { Scene } from 'phaser';
import Sprite = Phaser.GameObjects.Sprite;

export default class CoinRain extends Sprite {
	initialX: number;
	private static hasCreatedAnimations = false;
	constructor(scene: Scene, x: number, y: number) {
		super(scene, x, y, 'textures', 'coin');

		this.setOrigin(0, 0);
		this.scale = 0.75;
		this.setAlpha(0.5, 0.5, 0.5, 0.5);

		if (!CoinRain.hasCreatedAnimations) {
			scene.anims.create({
				key: 'coin-flip',
				frames: scene.anims.generateFrameNames('textures', {
					prefix: 'coin',
					zeroPad: 2,
					frames: [1, 2, 3, 4, 3, 2, 1]
				}),
				frameRate: 8,
				repeat: -1
			});
			CoinRain.hasCreatedAnimations = true;
		}

		this.play('coin-flip');
	}

	override setPosition(x?: number, y?: number, z?: number, w?: number): this {
		this.initialX = x;
		return super.setPosition(x, y, z, w);
	}

	update() {
		if (this.y > this.scene.renderer.height) {
			this.y = 0;
			this.x = this.initialX;
		}
	}
}
