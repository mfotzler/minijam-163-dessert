import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import { Player } from '../entities/Player';
import RenderSystem from '../systems/RenderSystem';
import InputSystem from '../systems/InputSystem';
import { EventType } from '../engine/types';
import PlayerHealthSystem from '../systems/PlayerHealthSystem';
import MessageBus from '../messageBus/MessageBus';

export default class MainScene extends BaseScene {
	static readonly key = 'MainScene';
	private wallLayer: Phaser.Tilemaps.TilemapLayer;
	private testPlayer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private currentHealth: number;
	private healthText: Phaser.GameObjects.Text;

	constructor() {
		super({ key: MainScene.key });
	}

	init() {
		super.init();

		this.listenForHealthChanges();

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
		this.testPlayer = this.physics.add.sprite(500, 800, 'textures', 'cupcake');
		this.testPlayer.setCollideWorldBounds(true);
		this.initializeMapAndCameras();
		this.createEntity(Player, {
			x: 350,
			y: 1000
		});
		this.drawHealthValue();
	}

	private listenForHealthChanges() {
		MessageBus.subscribe(EventType.PLAYER_HEALTH, (data) => {
			this.currentHealth = data.health;
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
		this.updateHealthText();
	}

	drawHealthValue(): void {
		this.healthText = this.add.text(30, 30, `Health: ${this.currentHealth}`, { fontSize: '32px' });
	}

	updateHealthText() {
		this.healthText.setText(`Health: ${this.currentHealth}`);
	}
}
