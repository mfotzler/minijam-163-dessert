import {StepData, System} from "../engine/types";
import {EntityProvider} from "../engine/world/types";
import {DessertComponents} from "../entities/types";

export default class InputSystem implements System {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    constructor(private scene: Phaser.Scene, private entityProvider: EntityProvider<DessertComponents>) {
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    step(data: StepData): Promise<void> | void {
        this.entityProvider.entities.forEach((entity) => {
            if (entity.position) {
                if (this.scene.input.keyboard.checkDown(this.cursors.right)) {
                    entity.position.x += 1;
                } else if (this.scene.input.keyboard.checkDown(this.cursors.left)) {
                    entity.position.x -= 1;
                }
            }
        });
    }

}