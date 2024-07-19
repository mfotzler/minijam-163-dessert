import * as Phaser from 'phaser';
import MessageBus from '../messageBus/MessageBus';
import {Messages} from '../messageBus/Messages';
import {GAME_CONFIG} from '../GameConfig';
import Container = Phaser.GameObjects.Container;
import Vector2 = Phaser.Math.Vector2;
import Arc = Phaser.GameObjects.Arc;
import Sprite = Phaser.GameObjects.Sprite;
import Body = Phaser.Physics.Arcade.Body;

const BALL_SIZE_THRESHOLDS = {
	small: GAME_CONFIG.BALL_SIZE_THRESHOLD_SMALL,
	medium: GAME_CONFIG.BALL_SIZE_THRESHOLD_MEDIUM,
	large: GAME_CONFIG.BALL_SIZE_THRESHOLD_LARGE
};

const PHYSICS_BODY_SIZE = {
	small: 50 / 2,
	medium: 100 / 2,
	large: 150 / 2
};

export default class CoinBall extends Container {
	private static hasCreatedAnimations = false;
	private readonly initialX: number;
	private readonly initialY: number;
	ballSprite: Sprite;
	distance: Vector2;
	force: Vector2;
	acceleration: Vector2;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private collisionArc: Arc,
	) {
		super(scene, x, y);

		this.initialY = y;
		this.initialX = x;

		if (!CoinBall.hasCreatedAnimations) {
			this.createBallAnimal(scene, 's');
			this.createBallAnimal(scene, 'm');
			this.createBallAnimal(scene, 'l');
			CoinBall.hasCreatedAnimations = true;
		}

		this.distance = new Vector2();
		this.force = new Vector2();
		this.acceleration = new Vector2();

		this.initializeMessageBus();
		this.ballSprite = scene.add.sprite(0, 0, 'textures').play('roll-s');
		this.add(this.ballSprite);
	}

	private createBallAnimal(scene: Phaser.Scene, size: string) {
		scene.anims.create({
			key: `roll-${size}`,
			frames: scene.anims.generateFrameNames('textures', {
				prefix: `coin-ball-${size}`,
				start: 1,
				end: 8,
				zeroPad: 2
			}),
			frameRate: 3,
			repeat: -1
		});
	}

	ballScale: number = GAME_CONFIG.INITIAL_BALL_SCALE;

	private initializeMessageBus() {
		MessageBus.subscribe<number>(Messages.BallScale, (value) => {
			this.ballScale = value ?? GAME_CONFIG.INITIAL_BALL_SCALE;
			this.setBallSize();
		});
	}

	public update() {
		this.moveBall();
		this.RotateBallSprite();
		this.decelerateBall();
		this.checkIfBallIsOutOfBounds();
	}

	private checkIfBallIsOutOfBounds() {
		if (!this.scene.physics.world.bounds.contains(this.x, this.y)) this.setBallPositionToInitial();
	}

	public setBallSize() {
		if (this.ballScale > BALL_SIZE_THRESHOLDS.large) {
			this.ballSprite.play('roll-l');
			(this.body as any as Body).setCircle(PHYSICS_BODY_SIZE.large, -75, -75);
		} else if (this.ballScale > BALL_SIZE_THRESHOLDS.medium) {
			this.ballSprite.play('roll-m');
			(this.body as any as Body).setCircle(PHYSICS_BODY_SIZE.medium, -50, -50);
		} else if (this.ballScale > BALL_SIZE_THRESHOLDS.small) {
			this.ballSprite.play('roll-s');
			(this.body as any as Body).setCircle(PHYSICS_BODY_SIZE.small, -25, -25);
		}
	}

	public resetBall() {
		MessageBus.sendMessage(Messages.BallScale, 1);
		this.setBallPositionToInitial();
	}

	private setBallPositionToInitial() {
		this.x = this.initialX;
		this.y = this.initialY;
	}

	private moveBall() {

		this.distance.copy(this.body['center']).subtract(this.collisionArc.body['center']);
		this.force
			.copy(this.distance)
			.setLength(85000 / this.distance.lengthSq())
			.limit(10);
			this.acceleration.copy(this.force).scale(1 / this.body.mass);
		this.body.velocity['add'](this.acceleration);
	}

	private RotateBallSprite() {
		let angle = this.getAngleOfAttack(this.body.velocity);
		let offset = -0.15;

		let rotation = angle + offset;

		this.ballSprite.setRotation(rotation);
	}

	private getAngleOfAttack(vector) {
		return Math.atan2(vector.y, vector.x) + 1.5;
	}

	private decelerateBall() {
		const decelerationFactor = 1.01;

		const moveToZero = (value: number) => {
			return value / decelerationFactor;
		};

		this.body.velocity.x = moveToZero(this.body.velocity.x);
		this.body.velocity.y = moveToZero(this.body.velocity.y);
	}
}
