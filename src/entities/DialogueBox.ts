import * as Phaser from 'phaser';
import { Messages } from '../messageBus/Messages';
import MessageBus from '../messageBus/MessageBus';
import BitmapText = Phaser.GameObjects.BitmapText;
import Container = Phaser.GameObjects.Container;
import Image = Phaser.GameObjects.Image;

export interface DialogueMessage {
	text: string;
	name: string;
	image: string;
}

export default class DialogueBox extends Container {
	private text: BitmapText;
	private clickIndicator: BitmapText;
	private nameText: BitmapText;
	private image: Image;
	private currentMessageIndex = 0;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private messages: DialogueMessage[]
	) {
		super(scene, x, y);

		const background = scene.add.nineslice(
			0,
			0,
			'textures',
			'menu-button',
			scene.renderer.width,
			420,
			20,
			20,
			20,
			20
		);
		background.setOrigin(0, 0);
		this.add(background);

		this.nameText = scene.add.bitmapText(350, 20, 'rubik', '');
		this.nameText.setOrigin(0, 0);
		this.add(this.nameText);

		this.text = scene.add.bitmapText(350, 100, 'rubik', '');
		this.text.setOrigin(0, 0);
		this.add(this.text);

		this.clickIndicator = scene.add.bitmapText(
			background.width - 420,
			340,
			'rubik',
			'Click to Continue'
		);
		this.clickIndicator.setOrigin(0, 0);
		this.add(this.clickIndicator);

		this.showMessage(messages[0]);
		// show the next message on click
		background.setInteractive();
		background.on('pointerdown', () => {
			if (this.currentMessageIndex < messages.length - 1) {
				this.currentMessageIndex++;
				this.showMessage(messages[this.currentMessageIndex]);
			}
			if (this.currentMessageIndex === messages.length - 1) {
				MessageBus.sendMessage(Messages.DialogueComplete, {});
			}
		});
	}

	private showMessage(message: DialogueMessage) {
		if (this.image) {
			this.image.destroy();
		}
		this.image = this.scene.add.image(20, 20, 'textures', message.image);
		this.image.setOrigin(0, 0);
		this.add(this.image);

		this.nameText.setText(message.name);
		this.text.setText(message.text);

		this.clickIndicator.setVisible(this.shouldShowIndicator());
	}

	private shouldShowIndicator() {
		return this.currentMessageIndex < this.messages.length - 1;
	}
}
