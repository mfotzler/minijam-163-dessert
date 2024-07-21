import { DessertComponents } from './types';

export const FrostingShot: DessertComponents = {
	movement: { hasGravity: true },
	collision: { killOnCollision: true, tiles: false },
	render: { spriteKey: 'coin' },
	projectile: { type: 'frosting', speed: 1000, cooldown: 20 }
};
