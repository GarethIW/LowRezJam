module LowRezJam {
    export class Mob {
        public Position: Point;
        public Forward: Point;
        public Left: Point;
        public Face = 0;

        private dungeon;

        constructor(dungeon: Dungeon, spawn: Point) {
            this.Position = spawn;
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

        public CalcFrame(heroFace: number) : number {
            var f = this.Face - heroFace;
            if (f < 0) f = 4 + f;

            return f;
        }

        private TryMove(l: number, f: number) {
            var loc = this.GetLoc(l, f);

            if (this.dungeon.Tiles[loc.Y][loc.X] == 1)
                this.Position = loc;

            if (this.dungeon.Tiles[loc.Y][loc.X] == 3)
                for (var d = 0; d < crawlergame.dungeon.Doors.length; d++)
                    if (crawlergame.dungeon.Doors[d].Position.X == loc.X && crawlergame.dungeon.Doors[d].Position.Y == loc.Y && crawlergame.dungeon.Doors[d].Open)
                        this.Position = loc;
                        
        }

        private DoTurn(dir: number) {
            this.Face += dir;
            if (this.Face == -1) this.Face = 3;
            if (this.Face == 4) this.Face = 0;

            switch (this.Face) {
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