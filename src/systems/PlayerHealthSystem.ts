import { EventType, StepData, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import { World } from '../world';

export default class PlayerHealthSystem implements System {
	private currentHealth: number;
	constructor(private world: World) {
		this.initializePlayerHealth();
		MessageBus.subscribe(EventType.PLAYER_HEALTH, this.onPlayerHealth.bind(this), {
			shouldInitializeWithLastMessage: true
		});
		MessageBus.subscribe(EventType.PLAYER_DAMAGE, this.onDamage.bind(this));
		MessageBus.subscribe(EventType.PLAYER_HEAL, this.onHeal.bind(this));
	}

	private initializePlayerHealth() {
		MessageBus.sendMessage(EventType.PLAYER_HEALTH, { health: 1 });
	}

	private onPlayerHealth(data: { health: number }) {
		this.currentHealth = data.health;

		if (data.health <= 0) {
			{
				MessageBus.sendMessage(EventType.PLAYER_DEAD, { isDead: true });
			}
		}
	}

	private onDamage(data: { damage: number }) {
		const playerEntity = this.world.entityProvider.getEntity(this.world.playerId);
		if (playerEntity?.player?.iframes > 0) return;

		playerEntity.player.iframes = 60;
		MessageBus.sendMessage(EventType.PLAYER_HEALTH, { health: this.currentHealth - data.damage });
	}

	private onHeal(data: { heal: number }) {
		MessageBus.sendMessage(EventType.PLAYER_HEALTH, { health: this.currentHealth + data.heal });
	}

	step(): Promise<void> | void {
		const playerEntity = this.world.entityProvider.getEntity(this.world.playerId);
		if (!playerEntity?.player) return;

		if (playerEntity.player.iframes > 0) {
			playerEntity.player.iframes--;
		}
	}
}
