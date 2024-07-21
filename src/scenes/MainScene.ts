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
import { CoinShotPickup, Grandma, SprinkeShotPickup } from '../entities/Pickups';
import { PickupSystem } from '../systems/PickupSystem';
import { MeleeSystem } from '../systems/MeleeSystem';
import { Asparatato } from '../entities/Enemies';
import { EnemySystem } from '../systems/EnemySystem';
import { MusicSystem } from '../systems/MusicSystem';
import { SoundEffectSystem } from '../systems/SoundEffectSystem';
import { GrandmaSystem } from '../systems/GrandmaSystem';
import { GameStateSystem } from '../systems/GameStateSystem';

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
		this.engine.addSystem(new PlayerHealthSystem(this.world));
		this.engine.addSystem(new WeaponSystem(this.world));
		this.engine.addSystem(new PickupSystem(this, this.world));
		this.engine.addSystem(new MeleeSystem(this.world));
		this.engine.addSystem(new EnemySystem(this.world));
		this.engine.addSystem(new MusicSystem(this));
		this.engine.addSystem(new SoundEffectSystem(this));
		this.engine.addSystem(new GrandmaSystem(this.world));
		this.engine.addSystem(new GameStateSystem(this));
	}

	preload() {
		super.preload();

		this.load.tilemapTiledJSON('map1', 'assets/map1.json');
		this.load.image('tiles', 'assets/wall.png');
		this.load.image('background', 'assets/background.png');

		this.debugGraphics = this.add.graphics();
	}

	create(): void {
		this.anims.create({
			key: 'player-walk',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'maincharacter',
				frames: [2, 3, 4, 5]
			}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'sprinkle-spin',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'sprinkle',
				frames: [1, 2, 3, 4]
			}),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'coin-spin',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'coin',
				zeroPad: 2,
				frames: [0, 1, 2, 3]
			}),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'pea',
			frames: this.anims.generateFrameNames('textures', {
				prefix: 'pea',
				frames: [1, 2, 3, 4]
			}),
			frameRate: 8,
			repeat: -1
		});

		this.initializeMapAndCameras();
		this.HealthDisplay = new HealthDisplay(this);
		this.world.addPlayer();

		this.readEnemyPlacementFromMap();

		super.create();
	}

	private readEnemyPlacementFromMap() {
		this.world.map.getObjectLayer('data dog sponsored by DataDog').objects.forEach((enemy) => {
			const entityTypes = {
				Asparatato: Asparatato,
				Grandma: Grandma,
				Sprinkle: SprinkeShotPickup
				// Brussel: Brussel,
				// Carrot: Carrot
			};

			if (entityTypes[enemy.name])
				this.world.createEntity(entityTypes[enemy.name], { x: enemy.x, y: enemy.y - 10 });
		});
	}

	protected startMusic() {
		MessageBus.sendMessage(EventType.MUSIC_PLAY, 'theme_3');
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
