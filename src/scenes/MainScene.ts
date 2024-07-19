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


export default class MainScene extends BaseScene {
	static readonly key = 'MainScene';

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
	}

	create(): void {
		this.createEntity(
			Player,
			{
				x: 350,
				y: 1000
			});
	}

	update(time: number, delta: number): void {
		this.engine.step(delta);
	}
}
