import {DessertComponents} from "../entities/types";
import {StepData, System} from "../engine/types";
import {EntityProvider} from "../engine/world/types";
import BaseScene from "../scenes/BaseScene";

export class MovementSystem implements System {
    private gravity: number = 5;
    constructor(private world: EntityProvider<DessertComponents>, private scene: BaseScene) {

    }

    step({ delta }: StepData) {
        this.world.entities.forEach(({ collision, render }) => {
            if (render) {
                const sprite = render.sprite;
                if (sprite) {
                    sprite.body.velocity.y += this.gravity;
                    if (collision) {
                        collision.blocked = { ...sprite.body.blocked };
                    }
                }
            }
        });
    }
}
