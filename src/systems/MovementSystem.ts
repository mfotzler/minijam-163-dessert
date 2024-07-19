import { StepData, System } from "../types";
import { EntityProvider } from "../world/types";
import { ExampleComponents } from "./components";

export class MovementSystem implements System {
    constructor(private world: EntityProvider<ExampleComponents>) {}

    step({ delta }: StepData) {
        this.world.entities.forEach(entity => {
            if (entity.position && entity.movement) {
                entity.position.x += entity.movement.velocityX * delta;
                entity.position.y += entity.movement.velocityY * delta;
            }
        });
    }
}
