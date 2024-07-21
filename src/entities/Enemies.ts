import { DessertComponents } from './types';

export const Asparatato: DessertComponents = {
	position: { x: 0, y: 0 },
	movement: { hasGravity: true },
	collision: { tiles: true, player: true, tags: ['projectile'] },
	render: { spriteKey: 'asparagus-potato-head', scale: 1 },
	enemy: {
		type: 'asparatato',
		health: 3,
		damage: 1
	}
};

export const Pea: DessertComponents = {
	movement: { initialVelocity: { x: 0, y: 200 } },
	collision: { killOnCollision: true, player: true },
	render: { spriteKey: 'pea1', scale: 1, currentAnimation: 'pea' },
	enemy: {
		damage: 1
	}
};

export const Brussel: DessertComponents = {
	position: { x: 0, y: 0 },
	movement: { hasGravity: true },
	collision: { tiles: true, player: true, tags: ['projectile'] },
	render: { spriteKey: 'sprout1', scale: 1, currentAnimation: 'sprout' },
	enemy: {
		type: 'brussel',
		health: 1,
		damage: 1
	}
};

export const Carrot: DessertComponents = {
	position: { x: 0, y: 0 },
	movement: { hasGravity: true },
	collision: { tiles: true, player: true, tags: ['projectile'] },
	render: { spriteKey: 'carrot1', scale: 1, currentAnimation: 'carrot' },
	enemy: {
		type: 'carrot',
		health: 2,
		damage: 1
	}
};
