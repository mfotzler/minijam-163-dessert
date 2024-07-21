import { WeaponType } from './Weapons';

export enum Direction {
	LEFT = 0,
	RIGHT = 1
}

export interface DessertComponents {
	player?: PlayerComponent;
	position?: PositionComponent;
	movement?: MovementComponent;
	render?: RenderComponent;
	facing?: FacingComponent;
	collision?: CollisionComponent;
	input?: InputComponent;
	projectile?: ProjectileComponent;
	weaponPickup?: WeaponPickupComponent;
	enemy?: EnemyComponent;
}

export interface RenderComponent {
	scale?: number;
	spriteSheet?: string;
	spriteKey?: string;
	sprite?: Phaser.Physics.Arcade.Sprite;
	followWithCamera?: boolean;
	currentAnimation?: string;
}

export interface FacingComponent {
	direction: Direction;
}

export interface MovementComponent {
	hasGravity?: boolean;
	killOnCollision?: boolean;
	initialVelocity?: { x: number; y: number };
	rotation?: { velocity?: number; startAngle?: number; origin?: { x: number; y: number } };
}

export interface PositionComponent {
	x: number;
	y: number;
}

export interface CollisionComponent {
	// if the object will be blocked by tiles
	tiles?: boolean;
	// if the object emits an event when hitting the player
	player?: boolean;
	blocked?: {
		up: boolean;
		down: boolean;
		left: boolean;
		right: boolean;
	};
	tags?: string[];
}

export interface ProjectileComponent {
	// used to check max number allowed alive
	type: WeaponType;
	// shot speed
	speed?: number;
	// how many ticks between shots
	cooldown: number;
	// how many ticks until it dies
	lifetime?: number;
	// how much damage it deals enemies
	damage?: number;
}

// just exists to say input controls it
export interface InputComponent {}

export interface PlayerComponent {
	currentWeapon: WeaponType;
	shotCooldown: number;
	iframes: number;
}

export interface WeaponPickupComponent {
	weaponType: WeaponType;
}

export interface EnemyComponent {
	health?: number;
	damage?: number;
	type?: string;
	aiState?: string;
	// for tracking how long the enemy has been in the current state
	stateTime?: number;
}
