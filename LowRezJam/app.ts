/// <reference path="phaser.d.ts"/>
/// <reference path="helper.ts"/>
/// <reference path="point.ts"/>
/// <reference path="dungeon.ts"/>
/// <reference path="hero.ts"/>
module LowRezJam {

    export class CrawlerGame{
        game: Phaser.Game;

        images: Phaser.Image[];
        dungeon: LowRezJam.Dungeon;
        hero: LowRezJam.Hero;
        cursor: Phaser.Sprite;

        fKey: Phaser.Key;
        bKey: Phaser.Key;
        tlKey: Phaser.Key;
        trKey: Phaser.Key;
        lKey: Phaser.Key;
        rKey: Phaser.Key;

        constructor() {
            var size = document.getElementById('content').clientWidth;

            this.game = new Phaser.Game(size, size, Phaser.CANVAS, 'content', { preload: this.preload, create: this.create, update: this.update }, false, false);

           
        }

        preload() {
            this.game.load.spritesheet("dungeon", "img/dungeon3.png", 32, 32, -1, 0, 0);
            this.game.load.spritesheet("cursor", "img/mouse.png", 4, 4, -1, 0, 0);
            this.game.stage.smoothed = false;
            this.game.canvas.getContext("2d").msImageSmoothingEnabled = false;

            this.game.input.mouse.capture = true;
            
        }

        create() {
            crawlergame.init();
            
        }

        update(time) {
            crawlergame.cursor.x = Math.floor(this.game.input.mousePointer.x / (crawlergame.game.width / 32)) * (crawlergame.game.width / 32);
            crawlergame.cursor.y = Math.floor(this.game.input.mousePointer.y / (crawlergame.game.width / 32)) * (crawlergame.game.width / 32);
            crawlergame.cursor.z = -9999;

            // Update doors
            for (var d = 0; d < crawlergame.dungeon.Doors.length; d++) {
                crawlergame.dungeon.Doors[d].Update(time);
            }

            // Set up images
            for (var i = 0; i < crawlergame.images.length; i++) {
                crawlergame.images[i].frame = LowRezJam.Helper.getFrame(this.game, 0, 0);
                crawlergame.images[i].scale.set(crawlergame.game.width / 32);
                crawlergame.images[i].crop(new Phaser.Rectangle(0, 0, 32, 32));
            }

            // Floor and ceiling image
            var imageNum = 0;
            crawlergame.images[imageNum].frame = LowRezJam.Helper.getFrame(this.game, 19, 0);

            imageNum++;
            for (var f = 4; f >= 0; f--) {
                for (var l = 3; l >= 0; l--) {
                    var loc = new Point(crawlergame.hero.Position.X + ((f * crawlergame.hero.Forward.X) + (l * crawlergame.hero.Left.X)),
                        crawlergame.hero.Position.Y + ((f * crawlergame.hero.Forward.Y) + (l * crawlergame.hero.Left.Y)));
                    if (loc.Y >= 0 && loc.Y < crawlergame.dungeon.Tiles.length && loc.X >= 0 && loc.X < crawlergame.dungeon.Tiles[loc.Y].length) {
                        if (crawlergame.dungeon.Tiles[loc.Y][loc.X] == 2) {
                            var checkLoc = new Point(crawlergame.hero.Position.X + (((f - 1) * crawlergame.hero.Forward.X) + (l * crawlergame.hero.Left.X)),
                                crawlergame.hero.Position.Y + (((f - 1) * crawlergame.hero.Forward.Y) + (l * crawlergame.hero.Left.Y)));
                            //if (crawlergame.dungeon.Tiles[checkLoc.Y][checkLoc.X] == 0) {
                            crawlergame.images[imageNum].frame = Helper.getFrame(this.game, 10 - l, f);
                            imageNum++;
                            //}

                            var checkLoc = new Point(crawlergame.hero.Position.X + ((f * crawlergame.hero.Forward.X) + ((l - 1) * crawlergame.hero.Left.X)),
                                crawlergame.hero.Position.Y + ((f * crawlergame.hero.Forward.Y) + ((l - 1) * crawlergame.hero.Left.Y)));
                            //if (crawlergame.dungeon.Tiles[checkLoc.Y][checkLoc.X] != 2) {
                            crawlergame.images[imageNum].frame = Helper.getFrame(this.game, 3 - l, f);
                            imageNum++;
                            //}

                        }
                        // door
                        if (crawlergame.dungeon.Tiles[loc.Y][loc.X] == 3) {
                            crawlergame.images[imageNum].frame = Helper.getFrame(this.game, 10 - l, f + 4);
                            imageNum++;
                            for (var d = 0;d<crawlergame.dungeon.Doors.length;d++) {
                                if (crawlergame.dungeon.Doors[d].Position.X == loc.X && crawlergame.dungeon.Doors[d].Position.Y == loc.Y) {
                                    //crawlergame.images[imageNum].frame = Helper.getFrame(this.game, 17 - l, f + 4);
                                    crawlergame.images[imageNum].crop(new Phaser.Rectangle((17 - l) * 32, (f + 4) * 32, 32, 32 - crawlergame.dungeon.Doors[d].OpenAmount));
                                   //crawlergame.images[imageNum].crop(new Phaser.Rectangle(0, 0, 32, 32 - crawlergame.dungeon.Doors[d].OpenAmount));
                                    imageNum++;
                                }
                            }
                        }
                    }

                    loc = new Point(crawlergame.hero.Position.X + ((f * crawlergame.hero.Forward.X) + (l * -crawlergame.hero.Left.X)),
                        crawlergame.hero.Position.Y + ((f * crawlergame.hero.Forward.Y) + (l * -crawlergame.hero.Left.Y)));
                    if (loc.Y >= 0 && loc.Y < crawlergame.dungeon.Tiles.length && loc.X >= 0 && loc.X < crawlergame.dungeon.Tiles[loc.Y].length) {
                        if (crawlergame.dungeon.Tiles[loc.Y][loc.X] == 2) {
                            crawlergame.images[imageNum].frame = Helper.getFrame(this.game, 10 + l, f);
                            imageNum++;

                            var checkLoc = new Point(crawlergame.hero.Position.X + ((f * crawlergame.hero.Forward.X) + ((l - 1) * -crawlergame.hero.Left.X)),
                                crawlergame.hero.Position.Y + ((f * crawlergame.hero.Forward.Y) + ((l - 1) * -crawlergame.hero.Left.Y)));
                            //if (crawlergame.dungeon.Tiles[checkLoc.Y][checkLoc.X] != 2) {
                            crawlergame.images[imageNum].frame = Helper.getFrame(this.game, 3 + l, f);
                            imageNum++;
                            //}

                        }
                        if (crawlergame.dungeon.Tiles[loc.Y][loc.X] == 3) {
                            crawlergame.images[imageNum].frame = Helper.getFrame(this.game, 10 + l, f + 4);
                            imageNum++;
                            for (var d = 0; d < crawlergame.dungeon.Doors.length; d++) {
                                if (crawlergame.dungeon.Doors[d].Position.X == loc.X && crawlergame.dungeon.Doors[d].Position.Y == loc.Y) {
                                    //crawlergame.images[imageNum].frame = Helper.getFrame(this.game, 17 + l, f + 4);
                                    crawlergame.images[imageNum].crop(new Phaser.Rectangle((17+l)*32, (f+4)*32, 32, 32 - crawlergame.dungeon.Doors[d].OpenAmount));
                                    //crawlergame.images[imageNum].scale.set(crawlergame.game.width / 32, Math.floor(crawlergame.game.width / (32 + crawlergame.dungeon.Doors[d].OpenAmount*2)));
                                    imageNum++;
                                }
                            }
                        }

                    }

                }
            }
        }

        init() {
            crawlergame.dungeon = new LowRezJam.Dungeon(30, 30, this.game);
            crawlergame.hero = new LowRezJam.Hero(crawlergame.dungeon);

            this.game.input.mouse.mouseDownCallback = this.mouseDown;

            crawlergame.fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
            crawlergame.fKey.onDown.add(crawlergame.hero.MoveForward, crawlergame.hero);
            crawlergame.bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            crawlergame.bKey.onDown.add(crawlergame.hero.MoveBackward, crawlergame.hero);
            crawlergame.tlKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
            crawlergame.tlKey.onDown.add(crawlergame.hero.TurnLeft, crawlergame.hero);
            crawlergame.trKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
            crawlergame.trKey.onDown.add(crawlergame.hero.TurnRight, crawlergame.hero);
            crawlergame.lKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
            crawlergame.lKey.onDown.add(crawlergame.hero.MoveLeft, crawlergame.hero);
            crawlergame.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            crawlergame.rKey.onDown.add(crawlergame.hero.MoveRight, crawlergame.hero);

            crawlergame.images = [];
            for (var i = 0; i < crawlergame.dungeon.Tiles.length * crawlergame.dungeon.Tiles[0].length; i++) {
                crawlergame.images.push(crawlergame.game.add.image(0, 0, "dungeon", 0));
                crawlergame.images[i].scale.set(crawlergame.game.width / 32);
                crawlergame.images[i].crop(new Phaser.Rectangle(0, 0, 32, 32));
                crawlergame.images[i].frame = LowRezJam.Helper.getFrame(this.game, 0, 0);
            }

            crawlergame.cursor = this.game.add.sprite(0, 0, "cursor", 0);
            crawlergame.cursor.scale.set(crawlergame.game.width / 32);
        }

        mouseDown(event) {
            var clickPoint = new Point(crawlergame.cursor.x / (crawlergame.game.width / 32), crawlergame.cursor.y / (crawlergame.game.width / 32));
            for (var f = 1; f <= 3; f++) {
                var l = 0;
                var loc = new Point(crawlergame.hero.Position.X + ((f * crawlergame.hero.Forward.X) + (l * crawlergame.hero.Left.X)),
                    crawlergame.hero.Position.Y + ((f * crawlergame.hero.Forward.Y) + (l * crawlergame.hero.Left.Y)));

                if (f == 1) {
                    for (var d = 0; d < crawlergame.dungeon.Doors.length; d++) {
                        if (crawlergame.dungeon.Doors[d].Position.X == loc.X && crawlergame.dungeon.Doors[d].Position.Y == loc.Y)
                            crawlergame.dungeon.Doors[d].Clicked(clickPoint);
                    }
                }
            }
        }

        public Generate() {
            this.init();
            //this.dungeon = new LowRezJam.Dungeon(30, 30, this.game);
            //this.hero = new LowRezJam.Hero(this.dungeon);
        }

    }
}

var crawlergame: LowRezJam.CrawlerGame;

window.onload = () => {

    crawlergame = new LowRezJam.CrawlerGame();

};