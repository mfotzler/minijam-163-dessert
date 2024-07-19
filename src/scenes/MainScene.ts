import * as Phaser from 'phaser';
import MessageBus from '../messageBus/MessageBus';
import { Messages } from '../messageBus/Messages';
import Timer from '../entities/Timer';
import GameOver from './GameOver';
import BaseScene from './BaseScene';
import Vacuum from '../entities/Vacuum';
import Player from '../entities/Player';
import Coin from '../entities/Coin';
import Goal from '../entities/Goal';
import ScoreBox from '../entities/ScoreBox';
import GameWon from './GameWon';
import Container = Phaser.GameObjects.Container;
import Group = Phaser.GameObjects.Group;
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import CoinRain from '../entities/CoinRain';
import BaseSound = Phaser.Sound.BaseSound;
import { GAME_CONFIG } from '../GameConfig';

export default class MainScene extends BaseScene {
	static readonly key = 'MainScene';
	private player: Player;
	private timeHandler: TimeHandler;
	private wallLayer: Phaser.Tilemaps.TilemapLayer;
	private coinPool: Group;
	private music: Phaser.Sound.BaseSound;
	private goal: Goal;
	private vacuum: Vacuum;
	private vacuum2: Vacuum;

	constructor() {
		super({ key: MainScene.key });
	}

	preload() {
		super.preload();

		this.load.tilemapTiledJSON('map1', 'assets/map1.json');
		this.load.image('tiles', 'assets/wall.png');
		this.load.audio('game_background', 'assets/game_background.mp3');
		this.load.audio('ball_die', 'assets/ball_die.wav');
		this.load.audio('coin_get', 'assets/coin_get.wav');
		this.load.audio('goal_score', 'assets/goal_score.wav');
	}

	create(): void {
		this.timeHandler = new TimeHandler();
		this.addPlayer();
		this.addTimer();
		this.addScoreBox();
		this.addGameOverHandler();
		this.playSound();
		this.addGoal();
		this.initializeMapAndCameras();
		this.makeCoinRainingEffect();
		this.vacuum = new Vacuum(this.scene.scene, 500, 400, this.player.ball, this.wallLayer);
		this.vacuum2 = new Vacuum(this.scene.scene, 800, 800, this.player.ball, this.wallLayer);
		this.add.existing<Container>(this.vacuum);
		this.add.existing<Container>(this.vacuum2);

		this.coinPool = this.add.group({
			classType: Coin,
			max: 50
		});

		MessageBus.clear(Messages.PlayerScore);
		MessageBus.clear(Messages.BallScale);

		this.initializeBallScale();
	}

	private addScoreBox() {
		let x = ScoreBox.ScoreBoxWidth / 2 + 30;

		this.add.existing<Container>(new ScoreBox(this, x, 220));
	}

	private addGoal() {
		this.goal = new Goal(this, 1800, 550, this.player.ball);
	}

	private playSound() {
		this.music = this.sound.add('game_background');

		this.music.play({ loop: true });
	}

	private initializeBallScale() {
		MessageBus.sendMessage(Messages.BallScale, 1);
	}

	private initializeMapAndCameras(): void {
		const map = this.make.tilemap({ key: 'map1' });
		const tileset = map.addTilesetImage('walls', 'tiles', 32, 32, 0, 0, 1);
		this.wallLayer = map.createLayer(0, tileset, 0, 0);
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		map.setCollision(1, true);

		this.physics.add.collider(this.player.ball, this.wallLayer);
	}

	update(time: number, delta: number): void {
		this.timeHandler.tick(delta);
		this.player.update();
		this.goal.update();
		this.vacuum.update();
		this.vacuum2.update();
		this.rainPool?.children.getArray().forEach((child) => child.update());
		this.makeItRainCoins(delta);
	}
	private timeUntilNextCoin = 0;
	private makeItRainCoins(delta: number) {
		let maxPossibleTimeTilNextCoin = 250;
		this.timeUntilNextCoin -= delta;

		if (this.timeUntilNextCoin <= 0) {
			this.spawnCoin(maxPossibleTimeTilNextCoin);
		}
	}

	private spawnCoin(maxPossibleTimeTilNextCoin: number) {
		this.timeUntilNextCoin = Math.random() * maxPossibleTimeTilNextCoin;
		const coin = this.coinPool.get();
		coin.setPosition(Math.random() * this.renderer.width, Math.random() * this.renderer.height);

		this.physics.add.collider(coin, this.player.ball, this.growBall.bind(this));
		this.physics.add.collider(coin, this.vacuum.collisionArc, this.destroyCoin.bind(this));
		this.physics.add.collider(coin, this.vacuum2.collisionArc, this.destroyCoin.bind(this));
	}

	rainPool: Group;
	private makeCoinRainingEffect() {
		this.rainPool = this.add.group({
			classType: CoinRain,
			max: 1337
		});

		while (this.rainPool.children.getArray().length < 320) {
			const coin = this.rainPool.get();
			coin.setPosition(Math.random() * this.renderer.width, Math.random() * this.renderer.height);
			this.physics.add.existing(coin);

			(coin as CoinRain).body.velocity.y = 270;
			(coin as CoinRain).body.velocity.x = -18;
		}
	}

	destroyCoin(coin: GameObjectWithBody) {
		coin.destroy();
	}

	growBall(coin: GameObjectWithBody) {
		this.destroyCoin(coin);

		this.playCoinPickupSoundEffect();

		let scale = MessageBus.getLastMessage<number>(Messages.BallScale);
		let growthFactor = GAME_CONFIG.COIN_GROWTH_FACTOR;

		MessageBus.sendMessage(Messages.BallScale, scale + growthFactor);
	}

	private coinPickupSoundEffect: BaseSound;
	private playCoinPickupSoundEffect() {
		if (!this.coinPickupSoundEffect) this.coinPickupSoundEffect = this.sound.add('coin_get');

		this.coinPickupSoundEffect.play();
	}

	private addTimer() {
		let x = Timer.TimerWidth / 2 + 30;

		this.add.existing<Container>(new Timer(this.scene.scene, x, 100));
	}

	private addGameOverHandler() {
		MessageBus.subscribe<void>(Messages.GameOver, () => {
			this.music.stop();

			let score = MessageBus.getLastMessage<number>(Messages.PlayerScore) ?? 0;
			this.processHighScore(score);

			let key = score > GAME_CONFIG.GAME_WIN_SCORE ? GameWon.key : GameOver.key;

			this.scene.start(key);
		});
	}

	private processHighScore(score: number) {
		let currentHighScore = MessageBus.getLastMessage<number>(Messages.HighScore) ?? 0;

		if (score >= currentHighScore) MessageBus.sendMessage(Messages.HighScore, score);
	}

	private addPlayer() {
		this.player = new Player(
			this,
			GAME_CONFIG.BLOWER_SAN_STARTING_X,
			GAME_CONFIG.BLOWER_SAN_STARTING_Y
		);
	}
}

class TimeHandler {
	private timeSinceLastTick: number = 0;

	tick(delta: number) {
		this.timeSinceLastTick += delta;
		if (this.timeSinceLastTick > 1000) {
			this.timeSinceLastTick = 0;
			MessageBus.sendMessage(Messages.SecondElapsed, {});
		}
	}
}
