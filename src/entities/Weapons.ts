import { DessertComponents } from './types';

export const FrostingShot: DessertComponents = {
	movement: { killOnCollision: true, hasGravity: true },
	collision: { tiles: false },
	render: { spriteKey: 'frosting', scale: 2 },
	projectile: { type: 'frosting', speed: 800, cooldown: 30 }
};

export const SprinkleShot: DessertComponents = {
	movement: { killOnCollision: true, hasGravity: false },
	collision: { tiles: false },
	render: { scale: 2, currentAnimation: 'sprinkle-spin' },
	projectile: { type: 'sprinkle', speed: 1000, cooldown: 15 }
};

export const RollingPin: DessertComponents = {
	movement: {
		killOnCollision: true,
		hasGravity: false,
		initialVelocity: { x: 0, y: 0 },
		rotation: { velocity: 360, startAngle: 280, origin: { x: 0, y: 0.5 } }
	},
	collision: { tiles: false },
	render: { spriteKey: 'rolling-pin', scale: 0.25 },
	projectile: { type: 'rolling-pin', cooldown: 15, lifetime: 240 }
};

export const Weapons = {
	frosting: FrostingShot,
	sprinkle: SprinkleShot,
	'rolling-pin': RollingPin
};

export type WeaponType = keyof typeof Weapons;
