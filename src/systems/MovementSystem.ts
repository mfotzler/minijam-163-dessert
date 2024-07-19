import {DessertComponents, Direction} from "../entities/types";
import {StepData, System} from "../engine/types";
import {EntityProvider} from "../engine/world/types";
import BaseScene from "../scenes/BaseScene";

export class MovementSystem implements System {
    private gravity: number = 5;
    constructor(private world: EntityProvider<DessertComponents>, private scene: BaseScene) {

    }

    step({ delta }: StepData) {
        this.world.entities.forEach(({ movement, collision, render, facing }) => {
            if (render) {
                const sprite = render.sprite;
                if (sprite) {
                    if (movement?.hasGravity) {
                        sprite.body.velocity.y += this.gravity;
                    }
                    
                    if (collision) {
                        collision.blocked = { ...sprite.body.blocked };
                    }

                    if (facing) {
                        if (sprite.body.velocity.x > 0) {
                            facing.direction = Direction.RIGHT;
                        } else if (sprite.body.velocity.x < 0) {
                            facing.direction = Direction.LEFT;
                        }
                    }
                }
            }
        });
    }
}
