import EventEmitter from "events";
import { EventType, StepData, System } from "../engine/types";
import BaseScene from "../scenes/BaseScene";
import { World } from "../world";

export class CollisionSystem implements System {
    constructor(private scene: BaseScene, private events: EventEmitter, private world: World) {
        events.on(EventType.ENTITY_ADDED, ({ id, entitySprite }: { id: string, entitySprite: Phaser.GameObjects.Sprite }) => {
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