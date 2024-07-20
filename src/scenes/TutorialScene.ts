import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import MainMenu from './MainMenu';
import DialogueBox from '../entities/DialogueBox';
import Container = Phaser.GameObjects.Container;

export default class TutorialScene extends BaseScene {
	static readonly key = 'Tutorial';
	private music: Phaser.Sound.BaseSound;
	constructor() {
		super({ key: TutorialScene.key });
	}

	create(): void {
		this.addTitle();
		this.addPlayButton();
		this.playSound();
		this.addGraphic();

		const dialogueBox = new DialogueBox(this.scene.scene, 0, this.renderer.height - DialogueBox.height, [
			{
				text:
					"Hey, I need your help!",
				name: 'Mr. Cupcake',
				image: 'cupcake-face'
			},
			{
				text:
					"The Evil Shady Vegetable Empire has" +
					"\nkidnapped all the grandmas!",
				name: 'Mr. Cupcake',
				image: 'cupcake-face'
			},
			{
				text:
					'No one will get to have dessert ' +
					'\never again at this rate!',
				name: 'Mr. Cupcake',
				image: 'cupcake-face'
			},
			{
				text:
					"You can move me around with " +
					"\nthe W, A, S, and D keys!",
				name: 'Mr. Cupcake',
				image: 'cupcake-face'
			},
			{
				text:
					"Click to shoot! I can bonk them" +
					"\nwith my rolling pin if you press F.",
				name: 'Mr. Cupcake',
				image: 'cupcake-face'
			},
		]);
		this.add.existing<Container>(dialogueBox);
	}

	addGraphic() {
		let image = this.add.image(this.renderer.width / 2 + 250, 50, 'tutorial-graphic');
		image.setOrigin(0.5, 0);
		image.scale = 0.7;
	}

	update(time: number, delta: number): void {}

	override preload() {
		super.preload();

		this.load.audio('lil_blower_san_theme', 'assets/lil_blower_san_theme.mp3');
		this.load.image('tutorial-graphic', 'assets/tutorial.png');
	}

	private playSound() {
		this.music = this.sound.add('lil_blower_san_theme');

		this.music.play({ loop: true });
	}

	private addTitle() {
		this.add.bitmapText(this.game.renderer.width / 2, 250, 'rubik', 'Tutorial').setOrigin(0.5, 0.5);
	}

	private addPlayButton() {
		UIHelpers.addButton(this, 320, 400, 'Main Menu', () => {
			this.music.stop();
			this.scene.start(MainMenu.key);
		});
	}
}
