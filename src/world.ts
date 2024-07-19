import { cloneDeep } from "lodash";
import { GameEngine } from "./engine/gameEngine";
import { EventType } from "./engine/types";
import { EntityCollection } from "./engine/world";
import { DessertComponents } from "./entities/types";
import BaseScene from "./scenes/BaseScene";
import { Player } from "./entities/Player";
import MessageBus from "./messageBus/MessageBus";

export interface Point {
    x: number,
    y: number
}

export class World {
    entityProvider: EntityCollection<DessertComponents>;
    map: Phaser.Tilemaps.Tilemap;
    wallLayer: Phaser.Tilemaps.TilemapLayer;
    playerId: string;

    constructor(private scene: BaseScene) {
        this.entityProvider = new EntityCollection();
    }

    initializeMap(key: string): void {
		this.map = this.scene.make.tilemap({ key });
		const tileset = this.map.addTilesetImage('walls', 'tiles');
		this.wallLayer = this.map.createLayer(0, tileset, 0, 0);
		this.wallLayer.setCollision(1, true);
	}

    addPlayer() {
        this.playerId = this.createEntity(Player, {
			x: 350,
			y: 1000
		});
    }

    createEntity(
        base: DessertComponents,
        { x, y }: Point,
    ): string {
        const id = this.entityProvider.createEntityId();
        MessageBus.sendMessage(EventType.ADD_ENTITY, {
            entity: {
                ...cloneDeep(base),
                position: {
                    ...base.position,
                    x,
                    y
                },
                id,
            },
        });
        return id;
    }
}