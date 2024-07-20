import { EventType, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import LevelWon from '../scenes/LevelWon';

export type GameState = {
	level: number;
	score: number;
};

export class GameStateSystem implements System {
	private static state: GameState = {
		level: 0,
		score: 0
	};

	constructor(private scene: BaseScene) {
		MessageBus.subscribe(EventType.SAVE_GRANDMA, () => {
			GameStateSystem.state.score += 100;
			GameStateSystem.state.level += 1;

			this.scene.fadeToScene(LevelWon.key, { fadeInDuration: 300 });
		});
	}

	step() {}
}
