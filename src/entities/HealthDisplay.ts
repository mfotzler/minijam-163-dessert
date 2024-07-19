import Phaser from 'phaser';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';

export default class HealthDisplay {
	private healthText: Phaser.GameObjects.Text;
	private currentHealth: number = 1;

	constructor(private scene: Phaser.Scene) {
		this.drawHealthValue();

		MessageBus.subscribe(
			EventType.PLAYER_HEALTH,
			(data) => {
				this.currentHealth = data.health;
				this.updateHealthText();
			},
			{
				shouldInitializeWithLastMessage: true
			}
		);
	}

	drawHealthValue(): void {
		this.healthText = this.scene.add.text(30, 30, `Health: ${this.currentHealth}`, {
			fontSize: '32px'
		});
	}

	updateHealthText() {
		this.healthText.setText(`Health: ${this.currentHealth}`);
	}
}
