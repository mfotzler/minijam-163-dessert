import * as Phaser from 'phaser';
import Container = Phaser.GameObjects.Container;
import CoinBall from './CoinBall';
import Sprite = Phaser.GameObjects.Sprite;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import Body = Phaser.Physics.Arcade.Body;
import BaseSound = Phaser.Sound.BaseSound;
import { Scene } from 'phaser';
import Arc = Phaser.GameObjects.Arc;

export default class Vacuum extends Container {
	private static hasCreatedAnimations = false;
	public vacuumSprite: Sprite;
	keepDirection: boolean = false;
	public collisionArc: Arc;
	static CreateAnimations(scene: Scene) {
		if (!Vacuum.hasCreatedAnimations) {
			scene.anims.create({
				key: 'vacuum',
				frames: scene.anims.generateFrameNames('textures', {
					prefix: 'vacuum',
					start: 1,
					end: 2,
					zeroPad: 2
				}),
				frameRate: 3,
				repeat: -1
			});
			Vacuum.hasCreatedAnimations = true;
		}
	}

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private ball: CoinBall,
		private walls: TilemapLayer
	) {
		super(scene, x, y);

		if (!Vacuum.hasCreatedAnimations) {
			Vacuum.CreateAnimations(scene);
		}

		this.vacuumSprite = scene.add.sprite(0, 0, 'textures').play('vacuum');
		this.vacuumSprite.scale = 1.5;
		this.scene.physics.add.existing(this.vacuumSprite);
		this.vacuumSprite.body['scale'] = 1.5;
		this.add(this.vacuumSprite);
		this.moveInARandomDirection();
		this.scene.physics.add.collider(this.vacuumSprite, this.walls, this.onWallCollide.bind(this));
		this.initializeArc(x, y);
	}

	update() {
		this.setArcLocation();

		this.scene.physics.collide(this.collisionArc, this.ball, this.onBallCollide.bind(this));
		if (this.isNotMovingFastEnough()) this.moveInARandomDirection();
	}

	private initializeArc(x: number, y: number) {
		this.collisionArc = this.scene.add.circle(x, y, 35, 0, 0);

		let physics = this.scene.physics.add.existing(this.collisionArc);
		(physics.body as Body).setCircle(35);
	}

	private setArcLocation() {
		let angle = this.vacuumSprite.rotation - Math.PI / 2;

		let magnitude = 100;

		const collisionY = Math.sin(angle) * magnitude;
		const collisionX = Math.cos(angle) * magnitude;

		this.collisionArc.x = collisionX + (this.vacuumSprite.body as Body).center.x;
		this.collisionArc.y = collisionY + (this.vacuumSprite.body as Body).center.y;
	}
	private shouldTryUpdatingDirection() {
		return !this.keepDirection;
	}

	private isNotMovingFastEnough() {
		let minVelocity = 100;

		let totalVelocity =
			Math.abs(this.vacuumSprite.body.velocity.x) + Math.abs(this.vacuumSprite.body.velocity.y);

		return totalVelocity < minVelocity;
	}

	onBallCollide() {
		this.playDeathSoundEffect();
		this.ball.resetBall();
	}

	deathSoundEffect: BaseSound;
	private playDeathSoundEffect() {
		if (!this.deathSoundEffect) this.deathSoundEffect = this.scene.sound.add('ball_die');

		if (!this.deathSoundEffect.isPlaying) this.deathSoundEffect.play();
	}

	onWallCollide() {
		if (this.shouldTryUpdatingDirection()) this.moveInARandomDirection();
	}

	private moveInARandomDirection() {
		let direction = this.getRandomDirection();
		let angle = this.getAngleOfAttack(direction);
		this.setAngleAndDirection(angle, direction);
	}

	private setAngleAndDirection(angle: number, direction: Phaser.Types.Math.Vector2Like) {
		this.vacuumSprite.rotation = angle;
		this.vacuumSprite.body.velocity.x = direction.x;
		this.vacuumSprite.body.velocity.y = direction.y;
		this.keepDirection = true;

		setTimeout(() => {
			this.keepDirection = false;
		}, 100);
	}

	private getAngleOfAttack(vector: Vector2Like) {
		return Math.atan2(vector.y, vector.x) + 1.5;
	}

	private getRandomDirection(): Vector2Like {
		let randomNumber = (max: number, min: number) =>
			(Math.random() * max + min) * (Math.random() > 0.5 ? 1 : -1);

		let x = randomNumber(100, 10);
		let y = randomNumber(100, 10);

		return { x, y };
	}
}
