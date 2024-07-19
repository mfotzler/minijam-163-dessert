import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import {GameEngine} from "../engine/gameEngine";
import {createTimer, Timer} from "../engine/timer";
import {EntityCollection} from "../engine/world";
import {ExampleComponents} from "../engine/example/components";
import {MovementSystem} from "../engine/example/movementSystem";
import {DessertComponents} from "../entities/types";
import {Player} from "../entities/Player";
import RenderSystem from "../systems/RenderSystem";
import InputSystem from "../systems/InputSystem";
import {EventType} from "../engine/types";


export default class MainScene extends BaseScene {
	static readonly key = 'MainScene';
	private wallLayer: Phaser.Tilemaps.TilemapLayer;
	private testPlayer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

	constructor() {
		super({ key: MainScene.key });
	}

	init() {
		super.init();

		this.engine.addSystem(new RenderSystem(this.engine.events, this, this.entities));
		this.engine.addSystem(new InputSystem(this, this.entities));
	}

	preload() {
		super.preload();

		this.load.tilemapTiledJSON('map1', 'assets/map1.json');
		this.load.image('tiles', 'assets/wall.png');
	}



	create(): void {
		this.testPlayer = this.physics.add.sprite(500, 800, 'textures', 'cupcake');
		this.testPlayer.setCollideWorldBounds(true);
		this.initializeMapAndCameras();
		this.createEntity(
			Player,
			{
				x: 350,
				y: 1000
			});
	}

	private initializeMapAndCameras(): void {
		const map = this.make.tilemap({ key: 'map1' });
		const tileset = map.addTilesetImage('walls', 'tiles');
		this.wallLayer = map.createLayer(0, tileset, 0, 0);
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.wallLayer.setCollisionByExclusion([], true);

		this.physics.add.collider(this.testPlayer, this.wallLayer);

		this.engine.events.on(EventType.ENTITY_ADDED, ({ id, entitySprite }) => {
			this.physics.add.existing(entitySprite);
			this.physics.add.collider(entitySprite, this.wallLayer);
		});
		this.physics.world.createDebugGraphic();
	}

	update(time: number, delta: number): void {
		this.engine.step(delta);
		this.testPlayer.y += 1;
	}
}
