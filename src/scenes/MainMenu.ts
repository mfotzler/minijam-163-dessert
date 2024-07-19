import MainScene from './MainScene';
import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import TutorialScene from './TutorialScene';
import Player from '../entities/Player';
import Vacuum from '../entities/Vacuum';
import Sprite = Phaser.GameObjects.Sprite;

export default class MainMenu extends BaseScene {
	static readonly key = 'MainMenu';
	constructor() {
		super({ key: MainMenu.key });
	}

	create(): void {
		this.addTitle();
		this.addPlayButton();
		this.addTutorialButton();
		this.addMeme();
		this.addPlayer();
		this.addCoins();
		this.addVacuum();
	}

	override preload() {
		super.preload();
		this.load.image('meme', 'assets/title_meme.png');
	}

	update(time: number, delta: number): void {
		this.player.sprite.setRotation(0.0015 * time);
	}

	private player: Player;

	private addPlayer() {
		this.player = new Player(this, 350, 500, false);
		this.player.sprite.scale = 2.5;
	}

	private vacuumSprite: Sprite;
	private addVacuum() {
		Vacuum.CreateAnimations(this);
		this.vacuumSprite = this.add.sprite(350, 900, 'textures').play('vacuum');
		this.vacuumSprite.scale = 1.5;
	}

	private addCoins() {
		this.anims.create({
			key: 'coin-flip',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'coin',
				zeroPad: 2,
				frames: [1, 2, 3, 4, 3, 2, 1]
			}),
			frameRate: 8,
			repeat: -1
		});

		let coin1 = this.add.sprite(130, 140, 'textures', 'coin');
		let coin2 = this.add.sprite(this.renderer.width - 130, 140, 'textures', 'coin');

		coin1.scale = 2;
		coin2.scale = 2;

		coin1.play('coin-flip');
		coin2.play('coin-flip');
	}

	private addMeme() {
		let meme = this.add.image(1550, 650, 'meme');
		meme.setOrigin(0.5, 0.5);
		meme.scale = 0.6;
	}

	private addTitle() {
		this.add.image(this.game.renderer.width / 2, 150, 'textures', 'title');
		this.add
			.bitmapText(
				this.game.renderer.width / 2,
				250,
				'rubik',
				'a game by bugvevo, slowback1, and mafcho'
			)
			.setOrigin(0.5, 0.5);
	}

	private addPlayButton() {
		UIHelpers.addCenteredButton(this, 400, 'Play', () => {
			this.scene.start(MainScene.key);
		});
	}

	private addTutorialButton() {
		UIHelpers.addCenteredButton(this, 600, 'Tutorial', () => {
			this.scene.start(TutorialScene.key);
		});
	}
}
