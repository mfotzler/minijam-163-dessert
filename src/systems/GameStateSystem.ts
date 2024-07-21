import { EventType, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import LevelWon from '../scenes/LevelWon';
import GameWon from '../scenes/GameWon';

export type GameState = {
	level: number;
	score: number;
};

const getInitialState = (): GameState => ({
	level: 0,
	score: 0
});

export class GameStateSystem implements System {
	private static state: GameState = getInitialState();

	constructor(private scene: BaseScene) {
		MessageBus.subscribe(EventType.SAVE_GRANDMA, () => {
			GameStateSystem.state.score += 100;
			GameStateSystem.state.level += 1;

			this.scene.fadeToScene(this.getSceneToFadeTo(), { fadeInDuration: 300 });
		});
	}

	private getSceneToFadeTo() {
		if (GameStateSystem.state.level < 3) {
			return LevelWon.key;
		}

		return GameWon.key;
	}

	step() {}

	static clearState() {
		GameStateSystem.state = getInitialState();
	}
}
