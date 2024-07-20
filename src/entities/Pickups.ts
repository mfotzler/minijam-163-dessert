import { DessertComponents, Direction } from './types';

export const SprinkeShotPickup: DessertComponents = {
	position: { x: 0, y: 0 },
	collision: { player: true },
	render: { spriteSheet: 'sprinkle', scale: 4, currentAnimation: 'sprinkle-spin' },
	weaponPickup: { weaponType: 'sprinkle' }
};

export const CoinShotPickup: DessertComponents = {
	position: { x: 0, y: 0 },
	collision: { player: true },
	render: { spriteSheet: 'coin', scale: 4, currentAnimation: 'coin-spin' },
	weaponPickup: { weaponType: 'coin' }
};

export const Grandma: DessertComponents = {
	position: { x: 0, y: 0 },
	collision: { player: true },
	render: { spriteKey: 'grandma1', scale: 0.25 },
	facing: { direction: Direction.LEFT },
	collisionType: { type: 'grandma' }
};
