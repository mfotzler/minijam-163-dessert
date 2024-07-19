import {EventType, StepData, System} from "../engine/types";
import {DessertComponents, PositionComponent, RenderComponent} from "../entities/types";
import {EntityCollection} from "../engine/world";
import BaseScene from "../scenes/BaseScene";
import {EventEmitter} from "events";

export default class RenderSystem implements System {
    private sprites: { [id: string]: Phaser.GameObjects.Sprite } = {};

    constructor(private events: EventEmitter, private scene: BaseScene, private entityProvider: EntityCollection<DessertComponents>) {
        this.events = events;

        this.events.on(EventType.ADD_ENTITY, ({ entity: { id, render } }) => {
            if (!this.sprites[id] && render) {
                const entitySprite = this.createSprite(render);
                this.sprites[id] = entitySprite;

                this.events.emit(EventType.ENTITY_ADDED, { entitySprite });
            }
        });

        this.events.on(EventType.ENTITY_DELETED, ({ entityId: id }) => {
            const entitySprite = this.sprites[id];
            if (entitySprite) {
                entitySprite.destroy();
                delete this.sprites[id];
            }
        });
    }

    private createSprite(render: RenderComponent): Phaser.GameObjects.Sprite {
        return this.scene.add.sprite(0, 0, 'textures', render.spriteKey);
    }
    step({ }: StepData) {
        this.entityProvider.entities.forEach((entity) => {
            const { render, position } = entity;

            if (render && position) {
                const entitySprite = this.getOrCreateSprite(entity.id, render);
                entitySprite.setPosition(position.x, position.y);
                entitySprite.update(entity);
            }
        });
    }

    private getOrCreateSprite(entityId: string, render: RenderComponent): Phaser.GameObjects.Sprite {
        let entitySprite: Phaser.GameObjects.Sprite;
        if (!this.sprites[entityId]) {
            entitySprite = this.createSprite(render);
            this.sprites[entityId] = entitySprite;
        } else {
            entitySprite = this.sprites[entityId];
        }
        return entitySprite;
    }
}