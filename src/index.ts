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
		width: 1920,
		height: 1080,
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [GameScene, MainScene, GameOver, TutorialScene, GameWon],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { x: 0, y: 0 },
			debug: false
		}
	}
});
