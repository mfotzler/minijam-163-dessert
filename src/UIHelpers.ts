import * as Phaser from 'phaser';

export default class UIHelpers {
	static addCenteredButton(
		scene: Phaser.Scene,
		y: number,
		text: string,
		onClick: () => void
	): Phaser.GameObjects.NineSlice {
		return this.addButton(scene, scene.renderer.width / 2, y, text, onClick);
	}

	static addButton(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		onClick: () => void
	): Phaser.GameObjects.NineSlice {
		const button = scene.add.nineslice(0, 0, 'textures', 'menu-button', 420, 80, 20, 20, 20, 20);
		button.setPosition(x, y);
		button.setInteractive();
		button.on('pointerdown', onClick);
		scene.add.bitmapText(x, y, 'rubik', text).setOrigin(0.5, 0.5);

		return button;
	}
}
