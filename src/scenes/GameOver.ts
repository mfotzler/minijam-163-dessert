import MainScene from './MainScene';
import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import DialogueBox from '../entities/DialogueBox';
import Container = Phaser.GameObjects.Container;

export default class GameOver extends BaseScene {
	static readonly key = 'GameOver';
	constructor() {
		super({ key: GameOver.key });
	}

	create(): void {
		this.addPlayButton();
		this.playSound();
		this.addDialogueBox();
	}

	update(time: number, delta: number): void {}

	override preload() {
		super.preload();

		this.load.audio('game_over', 'assets/game_over.mp3');
	}

	private playSound() {
		let music = this.sound.add('game_over');

		music.play();
	}

	private addDialogueBox() {
		const dialogueBox = new DialogueBox(
			this,
			0,
			this.renderer.height / 2 - 100,
			[
				{
					text: 'Too bad! You lost!',
					name: 'Mr. Cupcake',
					image: 'cupcake-face'
				}
			],
			this.startScene.bind(this)
		);
		this.add.existing<Container>(dialogueBox);
	}

	private addPlayButton() {
		UIHelpers.addButton(this, this.renderer.width / 2, 50, 'Play Again', () => {
			this.startScene();
		});
	}

	private startScene() {
		this.scene.start(MainScene.key);
	}
}
