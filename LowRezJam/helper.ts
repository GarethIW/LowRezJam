module LowRezJam {
    export class Helper {

        public static getFrame(game: Phaser.Game, x: number, y: number) {
            return (21*y) + x;
        }

        public static getScale(f: number, s: number) : Phaser.Point {
            switch(f) {
                case 1:
                    return new Phaser.Point(0.94 * s, 0.94 * s);
                case 2:
                    return new Phaser.Point(Math.floor(0.5 * s), Math.floor(0.5 * s));
                case 3:
                    return new Phaser.Point(Math.floor(0.22 * s), Math.floor(0.22 * s));
                default:
                    return new Phaser.Point(Math.floor(0 * s), Math.floor(0 * s));
            }
        }
    }
} 