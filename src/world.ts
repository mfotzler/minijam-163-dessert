import { cloneDeep } from "lodash";
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

        this.scene.add.tileSprite(0, 0, this.map.widthInPixels, 256, 'background')
            .setScale(4).setOrigin(0, 0).setDepth(-1);
	}

    addPlayer() {
        this.playerId = this.createEntity(Player, {
			x: 100,
			y: 200
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