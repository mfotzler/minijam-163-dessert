import * as Phaser from 'phaser';
import Container = Phaser.GameObjects.Container;
import { Scene } from 'phaser';
import CoinBall from './CoinBall';
import Arc = Phaser.GameObjects.Arc;
import Body = Phaser.Physics.Arcade.Body;
import MessageBus from '../messageBus/MessageBus';
import { Messages } from '../messageBus/Messages';
import BaseSound = Phaser.Sound.BaseSound;
import { GAME_CONFIG } from '../GameConfig';

export default class Goal extends Container {
	circle: Arc;
	constructor(
		scene: Scene,
		x: number,
		y: number,
		private ball: CoinBall
	) {
		super(scene, x, y);

		let radius = 50;

		this.circle = this.scene.add.circle(x, y, radius, 0x323232);
		this.scene.physics.add.existing(this.circle, true);
		(this.circle.body as Body).setCircle(radius);
	}

	update() {
		this.scene.physics.collide(this.circle, this.ball, this.onGoalTouch.bind(this));
	}

	onGoalTouch() {
		this.playGoalSoundEffect();
		let scale = MessageBus.getLastMessage(Messages.BallScale) ?? 1;
		let score = this.calculateScore(scale);
		let currentScore = MessageBus.getLastMessage(Messages.PlayerScore) ?? 0;

		MessageBus.sendMessage(Messages.PlayerScore, score + currentScore);
		this.ball.resetBall();
	}

	private goalSound: BaseSound;
	private playGoalSoundEffect() {
		if (!this.goalSound) this.goalSound = this.scene.sound.add('goal_score');

		if (!this.goalSound.isPlaying) this.goalSound.play();
	}

	private calculateScore(scale: number) {
		let baseScore = GAME_CONFIG.GOAL_SCORE_BASE;
		let perGrowthMultiplier = GAME_CONFIG.GOAL_SCORE_SCALE_MULTIPLIER;
		let baseScale = GAME_CONFIG.INITIAL_BALL_SCALE;

		let growthScore = (scale - baseScale) * 10 * perGrowthMultiplier;

		return Math.floor(baseScore + growthScore);
	}
}
