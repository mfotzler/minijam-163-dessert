import {DessertComponents} from "../entities/types";
import {StepData, System} from "../engine/types";
import {EntityProvider} from "../engine/world/types";
import BaseScene from "../scenes/BaseScene";

export class MovementSystem implements System {
    private gravity: number = 0.3;
    constructor(private world: EntityProvider<DessertComponents>, private scene: BaseScene) {

    }

    step({ delta }: StepData) {
        const deltaInSeconds = delta / 1000;
        this.world.entities.forEach(entity => {
            if (entity.position && entity.movement) {
                entity.movement.velocityY += this.gravity * deltaInSeconds;

                if (entity.collision?.blocked?.down && entity.movement.velocityY > 0) {
                    entity.movement.velocityY = 0;
                }
                if (entity.collision?.blocked?.up && entity.movement.velocityY < 0) {
                    entity.movement.velocityY = 0;
                }
                if (entity.collision?.blocked?.left && entity.movement.velocityX < 0) {
                    entity.movement.velocityX = 0;
                }
                if (entity.collision?.blocked?.right && entity.movement.velocityX > 0) {
                    entity.movement.velocityX = 0;
                }

                const canMoveDown = entity.movement.velocityY > 0 && !entity.collision?.blocked?.down;
                const canMoveUp = entity.movement.velocityY < 0 && !entity.collision?.blocked?.up;
                const canMoveLeft = entity.movement.velocityX < 0 && !entity.collision?.blocked?.left;
                const canMoveRight = entity.movement.velocityX > 0 && !entity.collision?.blocked?.right;

                if (canMoveLeft || canMoveRight) {
                    entity.position.x += entity.movement.velocityX * delta;
                }
                if (canMoveUp || canMoveDown) {
                    entity.position.y += entity.movement.velocityY * delta;
                }

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
