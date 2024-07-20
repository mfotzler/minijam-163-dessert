import { EventType, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import { DessertComponents } from '../entities/types';

export class GrandmaSystem implements System {
	private grandmaIds: string[] = [];

	constructor() {
		MessageBus.subscribe(
			EventType.ENTITY_ADDED,
			(data: { entity: DessertComponents; id: string }) => {
				const { entity } = data;

				if (entity.collisionType?.type === 'grandma') {
					this.grandmaIds.push(data.id);
				}
			}
		);

		MessageBus.subscribe(EventType.PLAYER_COLLISION, ({ id }) => {
			if (this.grandmaIds.includes(id)) {
				MessageBus.sendMessage(EventType.SAVE_GRANDMA, {});
			}
		});
	}

	step() {}
}
