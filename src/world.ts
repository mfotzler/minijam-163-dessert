import { cloneDeep } from "lodash";
import { GameEngine } from "./engine/gameEngine";
import { EventType } from "./engine/types";
import { EntityCollection } from "./engine/world";
import { DessertComponents } from "./entities/types";
import BaseScene from "./scenes/BaseScene";

export interface Point {
    x: number,
    y: number
}

export class World {
    entityProvider: EntityCollection<DessertComponents>;
    map: Phaser.Tilemaps.Tilemap;
    wallLayer: Phaser.Tilemaps.TilemapLayer;

    constructor(private scene: BaseScene, private engine: GameEngine) {
        this.entityProvider = new EntityCollection(this.engine.events);
    }

    initializeMap(key: string): void {
		this.map = this.scene.make.tilemap({ key });
		const tileset = this.map.addTilesetImage('walls', 'tiles');
		this.wallLayer = this.map.createLayer(0, tileset, 0, 0);
		this.wallLayer.setCollision(1, true);
	}

    createEntity(
        base: DessertComponents,
        { x, y }: Point,
    ) {
        this.engine.events.emit(EventType.ADD_ENTITY, {
            entity: {
                ...cloneDeep(base),
                position: {
                    ...base.position,
                    x,
                    y
                },
                id: this.entityProvider.createEntityId(),
            },
        });
    }
}