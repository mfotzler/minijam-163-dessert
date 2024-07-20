import * as Phaser from 'phaser';
import MessageBus from '../messageBus/MessageBus';
import { GameEngine } from '../engine/gameEngine';
import { musicTracks, soundEffectTracks, voiceClipTracks } from '../utils/soundTracks';

interface StartCallbackConfig {
	fadeInDuration?: number;
}

export default class BaseScene extends Phaser.Scene {
	private isFading = false;
	protected engine: GameEngine;

	preload(): void {
		this.load.atlas('textures', 'assets/texture.png', 'assets/texture.json');
		this.load.bitmapFont('rubik', 'assets/rubik-font_0.png', 'assets/rubik-font.fnt');

		for (const track of musicTracks) {
			this.load.audio(track, `assets/music/${track}.mp3`);
		}

		for (const track of soundEffectTracks) {
			this.load.audio(track, `assets/sfx/${track}.wav`);
		}

		for (const track of voiceClipTracks) {
			this.load.audio(`get-${track}`, `assets/sfx/${track}.m4a`);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	init(data?: unknown) {
		MessageBus.clearAllSubscribers();

		this.events.on('create', () => this.start(this, this.scene.settings.data), this);
		this.events.on('ready', this.start, this);
		this.events.on('wake', this.start, this);
		this.events.on('resume', this.start, this);
		this.events.on('start', this.start, this);
	}

	create() {
		this.startMusic();
	}

	protected startMusic() {}

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
}
