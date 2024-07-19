import * as Phaser from 'phaser';
import MessageBus from "../messageBus/MessageBus";

export default class BaseScene extends Phaser.Scene {

    init() {
        MessageBus.clearAllSubscribers();
    }

    preload():void {
        this.load.atlas('textures', 'assets/texture.png', 'assets/texture.json');
        this.load.bitmapFont('rubik', 'assets/rubik-font_0.png', 'assets/rubik-font.fnt');
    }
}
