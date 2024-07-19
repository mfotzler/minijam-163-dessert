import { GameEngine } from "../gameEngine";
import { createTimer, Timer } from "../timer";
import { EntityCollection } from "../world";
import { ExampleComponents } from "./components";
import { MovementSystem } from "./movementSystem";

export class ExampleGame {
    private engine: GameEngine;
    private timer: Timer;
    private entities: EntityCollection<ExampleComponents>;

    constructor() {
        this.engine = new GameEngine();
        this.timer = createTimer({
            duration: 1000 / 60,
            callback: this.step.bind(this),
        });

        this.entities = new EntityCollection(this.engine.events);

        this.engine.addSystem(new MovementSystem(this.entities));
    }

    public start() {
        this.timer.run();
    }

    public stop() {
        this.timer.stop();
    }

    private step(delta: number) {
        // maybe do my own clock ticking here
        this.engine.step(delta);
    }
}
