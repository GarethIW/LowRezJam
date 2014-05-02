/// <reference path="phaser.d.ts"/>
var LowRezJam;
(function (LowRezJam) {
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(640, 640, Phaser.CANVAS, 'content', { preload: this.preload, create: this.create, update: this.update }, false, false);
        }
        SimpleGame.prototype.preload = function () {
            this.game.load.spritesheet("dungeon", "img/dungeon.png", 32, 32, -1, 0, 0);
            this.game.stage.smoothed = false;
            this.game.canvas.getContext("2d").msImageSmoothingEnabled = false;
        };

        SimpleGame.prototype.create = function () {
            this.images = [];
            for (var i = 0; i < 20; i++) {
                this.images.push(this.game.add.image(0, 0, "dungeon", 0));
                this.images[i].scale.set(20, 20);
                this.images[i].crop(new Phaser.Rectangle(0, 0, 32, 32));
                this.images[i].frame = LowRezJam.Helper.getFrame(this.game, 0, 0);
            }

            this.dungeon = new LowRezJam.Dungeon();
            this.hero = new LowRezJam.Hero(this.dungeon.Spawn);
        };

        SimpleGame.prototype.update = function (time) {
            for (var i = 0; i < 20; i++) {
                this.images[i].frame = LowRezJam.Helper.getFrame(this.game, 0, 0);
                this.images[i].crop(new Phaser.Rectangle(0, 0, 16, 32));
            }

            // Floor and ceiling image
            var imageNum = 0;
            this.images[imageNum].frame = LowRezJam.Helper.getFrame(this.game, 0, 1);

            for (var y = this.hero.Position.Y - 3; y <= this.hero.Position.Y; y--) {
            }
        };
        return SimpleGame;
    })();
    LowRezJam.SimpleGame = SimpleGame;
})(LowRezJam || (LowRezJam = {}));

window.onload = function () {
    var game = new LowRezJam.SimpleGame();
};
//# sourceMappingURL=app.js.map
