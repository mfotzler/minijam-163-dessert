import EventEmitter from "events";
import { EventType, StepData, System } from "../engine/types";
import BaseScene from "../scenes/BaseScene";
import { World } from "../world";
import MessageBus from "../messageBus/MessageBus";

export class CollisionSystem implements System {
    constructor(scene: BaseScene, world: World) {
        MessageBus.subscribe(EventType.ENTITY_ADDED, ({ id, entitySprite }: { id: string, entitySprite: Phaser.GameObjects.Sprite }) => {
			const entity = world.entityProvider.getEntity(id);
            if (!entity.collision) return;

            if (entity.collision.tiles) {
                scene.physics.add.existing(entitySprite);
                scene.physics.add.collider(entitySprite, world.wallLayer);
            }
		});
    }

    step({ delta }: StepData) {

    }
}