import { DessertComponents } from './types';

export const FrostingShot: DessertComponents = {
	movement: { hasGravity: true },
	collision: { killOnCollision: true, tiles: false },
	render: { spriteKey: 'frosting', scale: 2 },
	projectile: { type: 'frosting', speed: 800, cooldown: 30, lifetime: 750 }
};

export const SprinkleShot: DessertComponents = {
	movement: { hasGravity: false },
	collision: { killOnCollision: true, tiles: false },
	render: { scale: 2, currentAnimation: 'sprinkle-spin', spriteKey: 'sprinkle1' },
	projectile: { type: 'sprinkle', speed: 1000, cooldown: 15, lifetime: 800 }
};

export const CoinShot: DessertComponents = {
	movement: { hasGravity: false },
	collision: { killOnCollision: true, tiles: false },
	render: { scale: 2, currentAnimation: 'coin-spin', spriteKey: 'coin01' },
	projectile: { type: 'coin', speed: 1000, cooldown: 15, lifetime: 900 }
};

export const RollingPin: DessertComponents = {
	movement: {
		hasGravity: false,
		initialVelocity: { x: 0, y: 0 },
		rotation: { velocity: -900, startAngle: -270, origin: { x: 0, y: 0.5 } }
	},
	collision: { tiles: false },
	render: { spriteKey: 'rolling-pin', scale: 0.25 },
	projectile: { type: 'rolling-pin', cooldown: 15, lifetime: 200, damage: 2, knockback: 500 }
};

export const Weapons = {
	frosting: FrostingShot,
	sprinkle: SprinkleShot,
	'rolling-pin': RollingPin,
	coin: CoinShot
};

export type WeaponType = keyof typeof Weapons;
