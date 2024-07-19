import {DessertComponents} from "./types";

export const Player: DessertComponents = {
	position: { x: 350, y: 1000 },
	movement: { velocityX: 0, velocityY: 0 },
	collision: { tiles: true },
	render: { spriteKey: 'cupcake' }
}