import { DessertComponents } from './types';

export const Asparatato: DessertComponents = {
	position: { x: 0, y: 0 },
	collision: { player: true, tags: ['projectile'] },
	render: { spriteKey: 'asparagus-potato-head', scale: 1 },
	enemy: {
		type: 'asparatato',
		health: 3,
		damage: 1
	}
};

export const Pea: DessertComponents = {
	movement: { killOnCollision: true, initialVelocity: { x: 0, y: 200 } },
	collision: { player: true },
	render: { spriteKey: 'pea1', scale: 1, currentAnimation: 'pea' },
	enemy: {
		damage: 1
	}
};
