import * as Phaser from 'phaser';
import GameScene from './scenes/MainMenu';
import MainScene from './scenes/MainScene';
import GameOver from './scenes/GameOver';
import TutorialScene from './scenes/TutorialScene';
import GameWon from './scenes/GameWon';
import MessageBus from './messageBus/MessageBus';
import getRealStorageProvider from './messageBus/realStorageProvider';

MessageBus.initialize(getRealStorageProvider());

new Phaser.Game({
	type: Phaser.AUTO,
	parent: 'game',
	backgroundColor: '#aaaaee',
	title: 'Something About Wind!',
	scale: {
		width: 1024,
		height: 512,
		mode: Phaser.Scale.ScaleModes.FIT,
		autoCenter: Phaser.Scale.Center.CENTER_BOTH
	},
	zoom: 1,
	scene: [GameScene, MainScene, GameOver, TutorialScene, GameWon],
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { x: 0, y: 0 },
			debug: false
		}
	}
});
