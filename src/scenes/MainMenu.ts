import MainScene from './MainScene';
import UIHelpers from '../UIHelpers';
import BaseScene from './BaseScene';
import TutorialScene from './TutorialScene';
import { GameStateSystem } from '../systems/GameStateSystem';

export default class MainMenu extends BaseScene {
	static readonly key = 'MainMenu';
	constructor() {
		super({ key: MainMenu.key });
	}

	create(): void {
		this.addTitle();
		this.addIntroButton();
		this.addPlayButton();
		this.addCoins();
	}

	override preload() {
		super.preload();
	}

	update(time: number, delta: number): void {}

	private addCoins() {
		this.anims.create({
			key: 'sprinkle-spin',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'sprinkle',
				frames: [1, 2, 3, 4]
			}),
			frameRate: 8,
			repeat: -1
		});

		let sprinkle1 = this.add.sprite(150, 90, 'textures', 'sprinkle1');
		let sprinkle2 = this.add.sprite(this.renderer.width - 150, 90, 'textures', 'sprinkle1');

		sprinkle1.scale = 4;
		sprinkle2.scale = 4;

		sprinkle1.play('sprinkle-spin');
		sprinkle2.play('sprinkle-spin');
	}

	private addTitle() {
		this.add.image(this.game.renderer.width / 2, 100, 'textures', 'title');
		this.add
			.bitmapText(
				this.game.renderer.width / 2,
				200,
				'rubik',
				'a game by tesserex, slowback1, and mafcho'
			)
			.setOrigin(0.5, 0.5);
	}

	private addIntroButton() {
		UIHelpers.addCenteredButton(this, 300, 'Intro', () => {
			this.scene.start(TutorialScene.key);
		});
	}

	private addPlayButton() {
		UIHelpers.addCenteredButton(this, 400, 'Play', () => {
			GameStateSystem.clearState();
			this.fadeToScene(MainScene.key, { fadeInDuration: 300 });
		});
	}
}
