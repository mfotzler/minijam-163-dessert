import * as Phaser from 'phaser';
import { Messages } from '../messageBus/Messages';
import MessageBus from '../messageBus/MessageBus';
import BitmapText = Phaser.GameObjects.BitmapText;
import Container = Phaser.GameObjects.Container;

export default class ScoreBox extends Container {
	private text: BitmapText;
	private score: number = 0;
	public static ScoreBoxWidth: number = 300;
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);

		const background = scene.add.nineslice(
			0,
			0,
			'textures',
			'menu-button',
			ScoreBox.ScoreBoxWidth,
			100,
			20,
			20,
			20,
			20
		);
		this.add(background);
		this.setDepth(9.99);

		this.text = scene.add.bitmapText(0, 0, 'rubik', `score: ${this.score}`);
		this.text.setOrigin(0.5, 0.5);
		this.add(this.text);

		MessageBus.subscribe<number>(Messages.PlayerScore, (score) => {
			this.score = score ?? 0;

			this.text.setText(`Score: ${this.score}`);
		});
	}
}
