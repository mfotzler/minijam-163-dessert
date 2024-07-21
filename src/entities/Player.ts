import { DessertComponents, Direction } from './types';

export const Player: DessertComponents = {
	player: { currentWeapon: 'frosting', shotCooldown: 0, iframes: 0 },
	position: { x: 350, y: 1000 },
	movement: { hasGravity: true },
	facing: { direction: Direction.RIGHT },
	collision: { tiles: true },
	render: {
		spriteKey: 'maincharacter1',
		followWithCamera: true,
		scale: 0.5
	},
	input: {}
};
