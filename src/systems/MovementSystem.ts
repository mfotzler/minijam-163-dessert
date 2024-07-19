import {DessertComponents} from "../entities/types";
import {StepData, System} from "../engine/types";
import {EntityProvider} from "../engine/world/types";
import BaseScene from "../scenes/BaseScene";

export class MovementSystem implements System {
    private gravity: number = 0.1;
    constructor(private world: EntityProvider<DessertComponents>, private scene: BaseScene) {}

    step({ delta }: StepData) {
        const deltaInSeconds = delta / 1000;
        this.world.entities.forEach(entity => {
            if (entity.position && entity.movement) {
                entity.movement.velocityY += this.gravity * deltaInSeconds;
                entity.position.x += entity.movement.velocityX * delta;
                entity.position.y += entity.movement.velocityY * delta;

                if (entity.position.y > this.scene.cameras.main.height) {
                    entity.position.y = this.scene.cameras.main.height;
                }
                if (entity.position.y < 0) {
                    entity.position.y = 0;
                }
                if (entity.position.x < 0) {
                    entity.position.x = 0;
                }
                if (entity.position.x > this.scene.cameras.main.width) {
                    entity.position.x = this.scene.cameras.main.width;
                }
            }
        });
    }
}
