import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import { GameEngine } from '../engine/gameEngine';
import { Player } from '../entities/Player';
import RenderSystem from '../systems/RenderSystem';
import InputSystem from '../systems/InputSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { World } from '../world';
import { CollisionSystem } from '../systems/CollisionSystem';
import PlayerHealthSystem from '../systems/PlayerHealthSystem';
import MessageBus from '../messageBus/MessageBus';
import { EventType } from '../engine/types';
import { WeaponSystem } from '../systems/WeaponSystem';
import HealthDisplay from '../entities/HealthDisplay';
import { SprinkeShotPickup } from '../entities/Pickups';
import { PickupSystem } from '../systems/PickupSystem';
import { MeleeSystem } from '../systems/MeleeSystem';

export default class MainScene extends BaseScene {
	static readonly key = 'MainScene';
	debugGraphics: Phaser.GameObjects.Graphics;
	private world: World;
	private HealthDisplay: HealthDisplay;

	constructor() {
		super({ key: MainScene.key });
	}

	init() {
		super.init();

		this.engine = new GameEngine();
		this.world = new World(this);

		this.engine.addSystem(new MovementSystem(this.world.entityProvider, this));
		this.engine.addSystem(new CollisionSystem(this, this.world));
		this.engine.addSystem(new RenderSystem(this, this.world.entityProvider));
		this.engine.addSystem(new InputSystem(this, this.world.entityProvider));
		this.engine.addSystem(new PlayerHealthSystem());
		this.engine.addSystem(new WeaponSystem(this.world));
		this.engine.addSystem(new PickupSystem(this, this.world));
		this.engine.addSystem(new MeleeSystem(this.world));
	}

	preload() {
		super.preload();

		this.load.tilemapTiledJSON('map1', 'assets/map1.json');
		this.load.image('tiles', 'assets/wall.png');
		this.load.image('background', 'assets/background.png');
		this.load.audio('weapon-pickup', 'assets/audio/weapon-pickup.wav');
		this.load.audio('get-sprinkle', 'assets/audio/sprinkle.m4a');

		this.debugGraphics = this.add.graphics();
	}

	create(): void {
		this.anims.create({
			key: 'sprinkle-spin',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'sprinkle',
				frames: [1, 2, 3, 4]
			}),
			frameRate: 8,
			repeat: -1
		});

		this.initializeMapAndCameras();
		this.HealthDisplay = new HealthDisplay(this);
		this.world.addPlayer();

		this.world.createEntity(SprinkeShotPickup, { x: 300, y: 300 });
	}

	private initializeMapAndCameras(): void {
		this.world.initializeMap('map1');

		this.cameras.main.setBounds(0, 0, this.world.map.widthInPixels, this.world.map.heightInPixels);
		//this.world.map.renderDebug(this.debugGraphics, {
		//	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255)
		//});
	}

	update(time: number, delta: number): void {
		this.engine.step(delta);
	}
}
