module LowRezJam {
    export class Helper {

        public static getFrame(game: Phaser.Game, x: number, y: number) {
            return (21*y) + x;
        }

    }
} 