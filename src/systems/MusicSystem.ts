import { EventType, StepData, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { musicTracks } from '../utils/soundTracks';

export type PlayMusicOptions = {
	track: string;
	loops?: boolean;
};

export class MusicSystem implements System {
	private currentTrack: string | null = null;
	private trackList: Record<string, Phaser.Sound.BaseSound> = {};

	constructor(private scene: BaseScene) {
		this.initializeTrackList();
		MessageBus.subscribe(EventType.MUSIC_PLAY, this.playMusic.bind(this), {
			shouldInitializeWithLastMessage: false
		});
		MessageBus.subscribe(EventType.MUSIC_STOP, this.stopMusic.bind(this), {
			shouldInitializeWithLastMessage: false
		});
	}

	private initializeTrackList() {
		for (const track of musicTracks) {
			this.trackList[track] = this.scene.sound.add(track);
		}
	}

	private stopMusic() {
		if (this.currentTrack) {
			this.trackList[this.currentTrack].stop();
		}
	}
	private playMusic(fileNameOrOptions: string | PlayMusicOptions) {
		const normalizedOptions = this.normalizePlayMusicOptions(fileNameOrOptions);

		const fileName = normalizedOptions.track;

		this.currentTrack = fileName;

		for (const track in this.trackList) {
			this.trackList[track].stop();
		}

		if (!this.trackList[fileName]) {
			this.trackList[fileName] = this.scene.sound.add(fileName);
		}

		this.trackList[fileName].play({ loop: normalizedOptions.loops, volume: 0.5 });
	}

	private normalizePlayMusicOptions(options: string | PlayMusicOptions): PlayMusicOptions {
		if (typeof options === 'string') {
			return { track: options, loops: true };
		}
		if (options.loops === undefined) {
			options.loops = true;
		}

		return options;
	}

	step(data: StepData): Promise<void> | void {}
}
