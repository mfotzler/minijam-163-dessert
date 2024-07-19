import {DessertComponents, Direction} from "./types";

export const Player: DessertComponents = {
	position: { x: 350, y: 1000 },
	movement: { hasGravity: true},
	facing: { direction: Direction.RIGHT },
	collision: { tiles: true },
	render: { spriteKey: 'cupcake' },
	input: {}
}