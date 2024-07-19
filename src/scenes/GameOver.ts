import MainScene from './MainScene';
import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import MessageBus from '../messageBus/MessageBus';
import { Messages } from '../messageBus/Messages';
import DialogueBox from '../entities/DialogueBox';
import Container = Phaser.GameObjects.Container;

export default class GameOver extends BaseScene {
	static readonly key = 'GameOver';
	constructor() {
		super({ key: GameOver.key });
	}

	create(): void {
		this.addTitle();
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
		const dialogueBox = new DialogueBox(this, 0, this.renderer.height - 420, [
			{
				text:
					'Try to blow through more coins next time!  There might be a secret ahead' +
					'\n if you get enough.',
				name: 'Blower-san',
				image: 'lil-blower-san01'
			}
		]);
		this.add.existing<Container>(dialogueBox);
	}

	private addTitle() {
		let score = MessageBus.getLastMessage<number>(Messages.PlayerScore) ?? 0;
		let highScore = MessageBus.getLastMessage<number>(Messages.HighScore) ?? 0;

		this.add
			.bitmapText(this.game.renderer.width / 2, 200, 'rubik', 'Game Over!')
			.setOrigin(0.5, 0.5);

		this.add
			.bitmapText(this.game.renderer.width / 2, 250, 'rubik', `Your Score: ${score}`)
			.setOrigin(0.5, 0.5);

		this.add
			.bitmapText(this.game.renderer.width / 2, 300, 'rubik', `High Score: ${highScore}`)
			.setOrigin(0.5, 0.5);
	}

	private addPlayButton() {
		UIHelpers.addCenteredButton(this, 400, 'Play Again', () => {
			this.scene.start(MainScene.key);
		});
	}
}
