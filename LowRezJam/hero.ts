module LowRezJam {
    export class Hero {
        public Position: Point;
        public Forward: Point;
        public Left: Point;

        private dungeon;
        private face = 0;

        constructor(dungeon: Dungeon) {
            this.Position = dungeon.Spawn;
            this.Forward = new Point(0, -1);
            this.Left = new Point(-1, 0);

            this.dungeon = dungeon;
        }

        public MoveForward() {
            this.TryMove(0, 1);
        }

        public MoveBackward() {
            this.TryMove(0, -1);
        }

        public MoveLeft() {
            this.TryMove(1, 0);
        }

        public MoveRight() {
            this.TryMove(-1, 0);
        }

        public TurnLeft() {
            this.DoTurn(-1);
        }

        public TurnRight() {
            this.DoTurn(1);
        }

        private TryMove(l: number, f: number) {
            var loc = this.GetLoc(l, f);
            if (this.dungeon.Tiles[loc.Y][loc.X] == 1)
                this.Position = loc;
        }

        private DoTurn(dir: number) {
            this.face += dir;
            if (this.face == -1) this.face = 3;
            if (this.face == 4) this.face = 0;

            switch (this.face) {
                case 0:
                    this.Forward = new Point(0, -1);
                    this.Left = new Point(-1, 0);
                    break;
                case 1:
                    this.Forward = new Point(1, 0);
                    this.Left = new Point(0, -1);
                    break;
                case 2:
                    this.Forward = new Point(0, 1);
                    this.Left = new Point(1, 0);
                    break;
                case 3:
                    this.Forward = new Point(-1, 0);
                    this.Left = new Point(0, 1);
                    break;
            }
        }

        private GetLoc(l: number, f: number) : Point {
            return new Point(this.Position.X + ((f * this.Forward.X) + (l * this.Left.X)),
                             this.Position.Y + ((f * this.Forward.Y) + (l * this.Left.Y)));
        }

    }
} 