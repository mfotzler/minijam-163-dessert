import * as Phaser from 'phaser';
import {StepData, System} from "../engine/types";
import {EntityProvider} from "../engine/world/types";
import {DessertComponents} from "../entities/types";
import Key = Phaser.Input.Keyboard.Key;

export default class InputSystem implements System {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private jumpKey: Phaser.Input.Keyboard.Key;
    constructor(private scene: Phaser.Scene, private entityProvider: EntityProvider<DessertComponents>) {
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    step(data: StepData): Promise<void> | void {
        this.entityProvider.entities.forEach((entity) => {
            if (entity.position) {
                if (this.scene.input.keyboard.checkDown(this.cursors.right)) {
                    entity.position.x += 1;
                } else if (this.scene.input.keyboard.checkDown(this.cursors.left)) {
                    entity.position.x -= 1;
                }

                // make him jump if the jump key is pressed and he's on the ground
                if (Phaser.Input.Keyboard.JustDown(this.jumpKey) && entity.position.y === this.scene.cameras.main.height) {
                    entity.movement.velocityY = -0.3;
                }
            }
        });
    }

}