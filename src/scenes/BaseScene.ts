import * as Phaser from 'phaser';
import MessageBus from "../messageBus/MessageBus";
import {DessertComponents} from "../entities/types";
import {cloneDeep} from "lodash";
import {EventType} from "../engine/types";
import {GameEngine} from "../engine/gameEngine";
import {EntityCollection} from "../engine/world";
import {MovementSystem} from "../systems/MovementSystem";

interface StartCallbackConfig {
    fadeInDuration?: number;
}

export default class BaseScene extends Phaser.Scene {
    private isFading = false;
    protected engine: GameEngine;
    protected entities: EntityCollection<DessertComponents>;

    preload():void {
        this.load.atlas('textures', 'assets/texture.png', 'assets/texture.json');
        this.load.bitmapFont('rubik', 'assets/rubik-font_0.png', 'assets/rubik-font.fnt');
    }


// eslint-disable-next-line @typescript-eslint/no-unused-vars
    init(data?: unknown) {
        MessageBus.clearAllSubscribers();

        this.engine = new GameEngine();

        this.entities = new EntityCollection(this.engine.events);

        this.engine.addSystem(new MovementSystem(this.entities));

        this.events.on('create', () => this.start(this, this.scene.settings.data), this);
        this.events.on('ready', this.start, this);
        this.events.on('wake', this.start, this);
        this.events.on('resume', this.start, this);
        this.events.on('start', this.start, this);
    }

    fadeToScene(key: string, args?: Record<string, unknown>) {
        if (this.isFading) return;
        this.cameras.main.fadeOut(300);
        this.isFading = true;
        this.input.keyboard.enabled = false;
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.sleep();
            this.scene.run(key, { fadeInDuration: 300, ...args });
            this.isFading = false;
        });
    }

    start(_scene: Phaser.Scene, { fadeInDuration }: StartCallbackConfig = {}) {
        if (fadeInDuration) {
            this.cameras.main.fadeIn(fadeInDuration);
            this.isFading = true;
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
                this.input.keyboard.enabled = true;
                this.isFading = false;
            });
        } else {
            this.cameras.main.resetFX();
            this.input.keyboard.enabled = true;
        }
    }

    protected createEntity(
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
                id: this.entities.createEntityId(),
            },
        });
    }
}

export interface Point {
    x: number,
    y: number
}