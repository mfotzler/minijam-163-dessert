import { DessertComponents } from './types';

export const SprinkeShotPickup: DessertComponents = {
	position: { x: 0, y: 0 },
	collision: { player: true },
	render: { spriteSheet: 'sprinkle', scale: 4, currentAnimation: 'sprinkle-spin' },
	weaponPickup: { weaponType: 'sprinkle' }
};
