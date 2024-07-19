import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import {GameEngine} from "../engine/gameEngine";
import {EntityCollection} from "../engine/world";
import {Player} from "../entities/Player";
import RenderSystem from "../systems/RenderSystem";
import InputSystem from "../systems/InputSystem";
import { MovementSystem } from '../systems/MovementSystem';
import { World } from '../world';
import { CollisionSystem } from '../systems/CollisionSystem';


export default class MainScene extends BaseScene {
	static readonly key = 'MainScene';
	private wallLayer: Phaser.Tilemaps.TilemapLayer;
	private testPlayer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private currentHealth: number;
	private healthText: Phaser.GameObjects.Text;
	debugGraphics: Phaser.GameObjects.Graphics;
	private world: World;

	constructor() {
		super({ key: MainScene.key });
	}

	init() {
		super.init();

		this.engine = new GameEngine();
		this.world = new World(this, this.engine);

        this.engine.addSystem(new MovementSystem(this.world.entityProvider, this));
		this.engine.addSystem(new CollisionSystem(this, this.engine.events, this.world));
		this.engine.addSystem(new RenderSystem(this.engine.events, this, this.world.entityProvider));
		this.engine.addSystem(new InputSystem(this, this.world.entityProvider));
		this.engine.addSystem(new RenderSystem(this.engine.events, this, this.entities));
		this.engine.addSystem(new InputSystem(this, this.entities));
		this.engine.addSystem(new PlayerHealthSystem());
	}

	preload() {
		super.preload();

		this.load.tilemapTiledJSON('map1', 'assets/map1.json');
		this.load.image('tiles', 'assets/wall.png');
	}

	create(): void {
		this.debugGraphics = this.add.graphics();
		this.initializeMapAndCameras();
		this.world.createEntity(
			Player,
			{
				x: 350,
				y: 1000
			});

		this.drawHealthValue();
	}

	private initializeMapAndCameras(): void {
		this.world.initializeMap('map1');

		this.cameras.main.setBounds(0, 0, this.world.map.widthInPixels, this.world.map.heightInPixels);
		this.world.map.renderDebug(this.debugGraphics, {
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
		});
	}

	update(time: number, delta: number): void {
		this.engine.step(delta);
		this.updateHealthText();
	}

	drawHealthValue(): void {
		this.healthText = this.add.text(30, 30, `Health: ${this.currentHealth}`, { fontSize: '32px' });
	}

	updateHealthText() {
		this.healthText.setText(`Health: ${this.currentHealth}`);
	}
}
