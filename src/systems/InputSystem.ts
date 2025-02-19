import * as Phaser from 'phaser';
import { EventType, StepData, System } from '../engine/types';
import { EntityProvider } from '../engine/world/types';
import { DessertComponents } from '../entities/types';
import MessageBus from '../messageBus/MessageBus';
import PHYSICS_CONSTANTS from '../utils/physicsConstants';

export default class InputSystem implements System {
	private leftKey: Phaser.Input.Keyboard.Key;
	private rightKey: Phaser.Input.Keyboard.Key;
	private jumpKey: Phaser.Input.Keyboard.Key;
	private alsoJumpKey: Phaser.Input.Keyboard.Key;
	private incrementHealthKey: Phaser.Input.Keyboard.Key;
	private decrementHealthKey: Phaser.Input.Keyboard.Key;
	private meleeKey: Phaser.Input.Keyboard.Key;

	constructor(
		private scene: Phaser.Scene,
		private entityProvider: EntityProvider<DessertComponents>
	) {
		this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.alsoJumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.incrementHealthKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
		this.decrementHealthKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
		this.meleeKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
	}

	step({}: StepData): Promise<void> | void {
		this.entityProvider.entities.forEach((entity) => {
			if (entity.render?.sprite && entity.input) {
				const body = entity.render.sprite.body;
				if (this.rightKey.isDown) {
					body.velocity.x = PHYSICS_CONSTANTS.PLAYER_RUN_SPEED;
					entity.render.currentAnimation = 'player-walk';
				} else if (this.leftKey.isDown) {
					body.velocity.x = -PHYSICS_CONSTANTS.PLAYER_RUN_SPEED;
					entity.render.currentAnimation = 'player-walk';
				} else {
					body.velocity.x = 0;
					entity.render.currentAnimation = undefined;
				}
				if (Phaser.Input.Keyboard.JustDown(this.incrementHealthKey))
					MessageBus.sendMessage(EventType.PLAYER_HEAL, { heal: 1 });
				if (Phaser.Input.Keyboard.JustDown(this.decrementHealthKey))
					MessageBus.sendMessage(EventType.PLAYER_DAMAGE, { damage: 1 });

				// make him jump if the jump key is pressed and he's on the ground
				if (
					(Phaser.Input.Keyboard.JustDown(this.jumpKey) ||
						Phaser.Input.Keyboard.JustDown(this.alsoJumpKey)) &&
					entity.collision?.blocked?.down
				) {
					body.velocity.y = -PHYSICS_CONSTANTS.PLAYER_JUMP_SPEED;
					MessageBus.sendMessage(EventType.SOUND_EFFECT_PLAY, { key: 'hop_2' });
				}

				if (this.scene.input.keyboard.checkDown(this.meleeKey)) {
					MessageBus.sendMessage(EventType.PLAYER_MELEE, undefined);
				}

				if (this.scene.input.mousePointer.primaryDown) {
					MessageBus.sendMessage(EventType.PLAYER_SHOOT, {
						mousePos: this.scene.input.mousePointer.positionToCamera(this.scene.cameras.main)
					});
				}
			}
		});
	}
}
