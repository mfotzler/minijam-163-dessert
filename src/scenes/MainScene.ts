import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import {GameEngine} from "../engine/gameEngine";
import {createTimer, Timer} from "../engine/timer";
import {EntityCollection} from "../engine/world";
import {ExampleComponents} from "../engine/example/components";
import {MovementSystem} from "../engine/example/movementSystem";
import {DessertComponents} from "../entities/types";


export default class MainScene extends BaseScene {
	static readonly key = 'MainScene';
	private engine: GameEngine;
	private entities: EntityCollection<DessertComponents>;

	constructor() {
		super({ key: MainScene.key });

		this.engine = new GameEngine();

		this.entities = new EntityCollection(this.engine.events);

		this.engine.addSystem(new MovementSystem(this.entities));
	}

	preload() {
		super.preload();
	}

	create(): void {
		let player = this.add.sprite(130, 140, 'textures', 'cupcake');
	}

	update(time: number, delta: number): void {
		this.engine.step(delta);
	}
}
