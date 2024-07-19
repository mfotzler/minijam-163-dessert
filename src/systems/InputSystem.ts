import * as Phaser from 'phaser';
import { EventType, StepData, System } from '../engine/types';
import { EntityProvider } from '../engine/world/types';
import { DessertComponents } from '../entities/types';
import Key = Phaser.Input.Keyboard.Key;
import MessageBus from '../messageBus/MessageBus';

export default class InputSystem implements System {
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private jumpKey: Phaser.Input.Keyboard.Key;
	private incrementHealthKey: Phaser.Input.Keyboard.Key;
	private decrementHealthKey: Phaser.Input.Keyboard.Key;

	constructor(
		private scene: Phaser.Scene,
		private entityProvider: EntityProvider<DessertComponents>
	) {
		this.cursors = scene.input.keyboard.createCursorKeys();
		this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.incrementHealthKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
		this.decrementHealthKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
	}

    step(data: StepData): Promise<void> | void {
        this.entityProvider.entities.forEach((entity) => {
            if (entity.position) {
                if (this.scene.input.keyboard.checkDown(this.cursors.right)) {
                    entity.movement.velocityX = 0.1;
                } else if (this.scene.input.keyboard.checkDown(this.cursors.left)) {
                    entity.movement.velocityX -= 0.1;
                } else {
                    entity.movement.velocityX = 0;
                }
							if (Phaser.Input.Keyboard.JustDown(this.incrementHealthKey))
								MessageBus.sendMessage(EventType.PLAYER_HEAL, { heal: 1 });
							if (Phaser.Input.Keyboard.JustDown(this.decrementHealthKey))
								MessageBus.sendMessage(EventType.PLAYER_DAMAGE, { damage: 1 });



							// make him jump if the jump key is pressed and he's on the ground
                if (Phaser.Input.Keyboard.JustDown(this.jumpKey) && entity.collision?.blocked?.down) {
                    entity.movement.velocityY = -0.3;
                }
            }
        });
    }

}
