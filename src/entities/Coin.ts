import * as Phaser from 'phaser';

import { Scene } from 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import Body = Phaser.Physics.Arcade.Body;

export default class Coin extends Sprite {
	constructor(scene: Scene, x: number, y: number) {
		super(scene, x, y, 'textures', 'coin');

		this.setOrigin(0, 0);
		this.scene.physics.add.existing(this);

		const yeet = 0;

		(this.body as Body).setCircle(25, yeet, yeet);
	}
}
