import { DessertComponents } from './types';

export const FrostingShot: DessertComponents = {
	movement: { killOnCollision: true, hasGravity: true },
	collision: { tiles: false },
	render: { spriteKey: 'coin' },
	projectile: { type: 'frosting', speed: 800, cooldown: 30 }
};

export const SprinkleShot: DessertComponents = {
	movement: { killOnCollision: true, hasGravity: false },
	collision: { tiles: false },
	render: { spriteSheet: 'sprinkle', scale: 2, currentAnimation: 'sprinkle-spin' },
	projectile: { type: 'sprinkle', speed: 1000, cooldown: 15 }
};

export const RollingPin: DessertComponents = {
	movement: {
		killOnCollision: true,
		hasGravity: false,
		initialVelocity: { x: 0, y: 0 },
		rotation: { velocity: 90, y: 0 }
	},
	collision: { tiles: false },
	render: { spriteSheet: 'candycane', scale: 4 },
	projectile: { type: 'rolling-pin', cooldown: 15, lifetime: 180 }
};

export const Weapons = {
	frosting: FrostingShot,
	sprinkle: SprinkleShot,
	'rolling-pin': RollingPin
};

export type WeaponType = keyof typeof Weapons;
