import {EventType, StepData, System} from "../engine/types";
import {DessertComponents, RenderComponent} from "../entities/types";
import {EntityCollection} from "../engine/world";
import BaseScene from "../scenes/BaseScene";
import {EventEmitter} from "events";
import { EntityDefinition } from "../engine/entities/types";

export default class RenderSystem implements System {
    private sprites: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};

    constructor(private events: EventEmitter, private scene: BaseScene, private entityProvider: EntityCollection<DessertComponents>) {
        this.events = events;

        this.events.on(EventType.ADD_ENTITY, ({ entity }: { entity: EntityDefinition<DessertComponents> }) => {
            const { id, position, movement, render } = entity;
            if (!this.sprites[id] && render) {
                const entitySprite = this.createSprite(render);
                entitySprite.setPosition(position?.x ?? 0, position?.y ?? 0);
                if (movement?.initialSpeed) {
                    entitySprite.setVelocity(movement.initialSpeed.x, movement.initialSpeed.y);
                }
                this.sprites[id] = entitySprite;

                this.events.emit(EventType.ENTITY_ADDED, { id, entitySprite });
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

    private createSprite(render: RenderComponent): Phaser.Physics.Arcade.Sprite {
        return this.scene.physics.add.sprite(0, 0, 'textures', render.spriteKey);
    }

    step({ }: StepData) {
        this.entityProvider.entities.forEach((entity) => {
            const { render, position } = entity;

            if (render && position) {
                this.ensureEntityHasSprite(entity.id, render);
            }
        });
    }

    private ensureEntityHasSprite(entityId: string, render: RenderComponent) {
        if (!this.sprites[entityId]) {
            this.sprites[entityId] = this.createSprite(render);
        }
        if (!render.sprite) {
            render.sprite = this.sprites[entityId];
        }
        
    }
}