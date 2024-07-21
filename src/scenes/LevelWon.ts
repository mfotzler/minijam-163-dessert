import MainScene from './MainScene';
import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import MessageBus from '../messageBus/MessageBus';
import DialogueBox from '../entities/DialogueBox';
import Container = Phaser.GameObjects.Container;
import { EventType } from '../engine/types';

export default class LevelWon extends BaseScene {
	static readonly key = 'LevelWon';
	constructor() {
		super({ key: LevelWon.key });
	}

	create(): void {
		this.addPlayButton();
		this.addDialogueBox();

		MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, 'complete_1');
	}

	update(time: number, delta: number): void {}

	override preload() {
		super.preload();
	}

	private addDialogueBox() {
		const dialogueBox = new DialogueBox(
			this.scene.scene,
			0,
			this.renderer.height - DialogueBox.height,
			[
				{
					text: 'You saved a grandma! \r\nSave more for the secret ending!',
					name: 'Mr. Cupcake',
					image: 'cupcake-face'
				}
			],
			() => this.scene.start(MainScene.key)
		);
		this.add.existing<Container>(dialogueBox);
	}

	private addPlayButton() {
		UIHelpers.addButton(this, this.renderer.width / 2, 50, "Keep on Truckin'", () => {
			this.scene.start(MainScene.key);
		});
	}
}
