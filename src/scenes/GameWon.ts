import MainScene from './MainScene';
import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import MessageBus from '../messageBus/MessageBus';
import DialogueBox from '../entities/DialogueBox';
import Container = Phaser.GameObjects.Container;
import { EventType } from '../engine/types';
import MainMenu from './MainMenu';
import { GameStateSystem } from '../systems/GameStateSystem';

export default class GameWon extends BaseScene {
	static readonly key = 'GameWon';
	constructor() {
		super({ key: GameWon.key });
	}

	drawWhiteBackground() {
		this.add.rectangle(0, 0, this.renderer.width, this.renderer.height, 0xffffff).setOrigin(0, 0);
	}

	create(): void {
		this.drawWhiteBackground();
		this.addDialogueBox();
		this.addImage();

		MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, 'complete_1');
	}

	update(time: number, delta: number): void {}

	override preload() {
		super.preload();

		this.load.image('win-screen', 'assets/win_screen.png');
	}

	private addImage() {
		const image = this.add.image(
			this.renderer.width / 2,
			this.renderer.height / 2 - 100,
			'win-screen'
		);
		image.setOrigin(0.5);
		image.setScale(0.5, 0.5);
	}

	private addDialogueBox() {
		const dialogueBox = new DialogueBox(
			this.scene.scene,
			0,
			this.renderer.height - DialogueBox.height,
			[
				{
					text: 'You saved all of the \r\ngrandmas :D!',
					name: 'Mr. Cupcake',
					image: 'cupcake-face'
				},
				{
					text: 'Now we can all have cake\r\nand sharing is caring!',
					name: 'Mr. Cupcake',
					image: 'cupcake-face'
				}
			],
			() => {
				GameStateSystem.clearState();
				this.fadeToScene(MainScene.key, { fadeInDuration: 300 });
			}
		);
		this.add.existing<Container>(dialogueBox);
	}
}
