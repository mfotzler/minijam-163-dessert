import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import MainMenu from './MainMenu';
import DialogueBox from '../entities/DialogueBox';
import Container = Phaser.GameObjects.Container;

export default class TutorialScene extends BaseScene {
	static readonly key = 'Tutorial';
	private music: Phaser.Sound.BaseSound;
	private background: Phaser.GameObjects.TileSprite;
	constructor() {
		super({ key: TutorialScene.key });
	}

	create(): void {
		this.addGraphic();
		this.addPlayButton();
		this.playSound();

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
		this.background = this.add.tileSprite(0, 0, this.renderer.width, this.renderer.width, 'background')
			.setScale(3).setOrigin(0, 0).setDepth(-1);
	}

	update(time: number, delta: number): void {
		this.background.setTilePosition(time / 75, 0);
	}

	override preload() {
		super.preload();

		this.load.image('background', 'assets/background.png');
		this.load.audio('lil_blower_san_theme', 'assets/lil_blower_san_theme.mp3');
		this.load.image('tutorial-graphic', 'assets/tutorial.png');
	}

	private playSound() {
		this.music = this.sound.add('lil_blower_san_theme');

		this.music.play({ loop: true });
	}

	private addPlayButton() {
		UIHelpers.addButton(this, this.renderer.width / 2, 50, 'Back to Main Menu', () => {
			this.music.stop();
			this.scene.start(MainMenu.key);
		});
	}
}
