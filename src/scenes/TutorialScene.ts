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

		const dialogueBox = new DialogueBox(this.scene.scene, 0, this.renderer.height - 420, [
			{
				text:
					"Greetings! Allow me to introduce myself as Lil' Blower-san! I'm in dire need of " +
					'\n your assistance to gather up these coins that have mysteriously started ' +
					'\n falling from the sky!',
				name: 'Blower-san',
				image: 'lil-blower-san01'
			},
			{
				text:
					'Harness my breezy powers to maneuver the coin ball. Simply direct it towards' +
					'\n coins to incorporate them into your coin empire!',
				name: 'Blower-san',
				image: 'lil-blower-san01'
			},
			{
				text:
					"You can click the screen to move me! I'll always face the ball of coins.",
				name: 'Blower-san',
				image: 'lil-blower-san01'
			},
			{
				text:
					"Once you've amassed your coin hoard, guide the ball to the designated " +
					'\n goal hole to secure those valuable points!',
				name: 'Blower-san',
				image: 'lil-blower-san01'
			},
			{
				text:
					"Strive to accumulate as many points as possible, and perhaps I'll unveil a" +
					'\n delightful surprise. Best of luck!',
				name: 'Blower-san',
				image: 'lil-blower-san01'
			}
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
