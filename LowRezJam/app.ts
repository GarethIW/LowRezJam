/// <reference path="phaser.d.ts"/>
class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(640, 640, Phaser.CANVAS, 'content', { preload: this.preload, create: this.create }, false, false);
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('mock', 'img/lowrez.png');
        this.game.stage.smoothed = false;
        this.game.canvas.getContext("2d").msImageSmoothingEnabled = false;
    }

    create() {
        var logo = this.game.add.sprite(0, 0, 'mock');
        logo.anchor.setTo(0, 0);
        logo.scale.x = 20.0;
        logo.scale.y = 20.0;
    }

}

window.onload = () => {

    var game = new SimpleGame();

};