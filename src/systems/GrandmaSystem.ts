import { EventType, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import { World } from '../world';

export class GrandmaSystem implements System {
	constructor(world: World) {
		MessageBus.subscribe(EventType.PLAYER_COLLISION, ({ id }) => {
			const entity = world.entityProvider.getEntity(id);
			if (entity.collision?.tags?.includes('grandma')) {
				MessageBus.sendMessage(EventType.SAVE_GRANDMA, {});
				MessageBus.sendMessage(EventType.MUSIC_PLAY, { track: 'game_win', loops: false });

				MessageBus.sendMessage(EventType.DELETE_ENTITY, { entityId: id });
			}
		});
	}

	step() {}
}
