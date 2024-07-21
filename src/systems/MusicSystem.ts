import { EventType, StepData, System } from '../engine/types';
import MessageBus from '../messageBus/MessageBus';
import BaseScene from '../scenes/BaseScene';
import { musicTracks } from '../utils/soundTracks';

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
	private playMusic(fileName: string) {
		this.currentTrack = fileName;

		for (const track in this.trackList) {
			this.trackList[track].stop();
		}

		if (!this.trackList[fileName]) {
			this.trackList[fileName] = this.scene.sound.add(fileName);
		}

		this.trackList[fileName].play({ loop: true, volume: 0.5 });
	}

	step(data: StepData): Promise<void> | void {}
}
