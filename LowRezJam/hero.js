var LowRezJam;
(function (LowRezJam) {
    var Hero = (function () {
        function Hero(dungeon) {
            this.face = 0;
            this.Position = dungeon.Spawn;
            this.Forward = new LowRezJam.Point(0, -1);
            this.Left = new LowRezJam.Point(-1, 0);

            this.dungeon = dungeon;
        }
        Hero.prototype.MoveForward = function () {
            this.TryMove(0, 1);
        };

        Hero.prototype.MoveBackward = function () {
            this.TryMove(0, -1);
        };

        Hero.prototype.MoveLeft = function () {
            this.TryMove(1, 0);
        };

        Hero.prototype.MoveRight = function () {
            this.TryMove(-1, 0);
        };

        Hero.prototype.TurnLeft = function () {
            this.DoTurn(-1);
        };

        Hero.prototype.TurnRight = function () {
            this.DoTurn(1);
        };

        Hero.prototype.TryMove = function (l, f) {
            var loc = this.GetLoc(l, f);

            if (this.dungeon.Tiles[loc.Y][loc.X] == 1)
                this.Position = loc;

            if (this.dungeon.Tiles[loc.Y][loc.X] == 3)
                for (var d = 0; d < crawlergame.dungeon.Doors.length; d++)
                    if (crawlergame.dungeon.Doors[d].Position.X == loc.X && crawlergame.dungeon.Doors[d].Position.Y == loc.Y && crawlergame.dungeon.Doors[d].Open)
                        this.Position = loc;
        };

        Hero.prototype.DoTurn = function (dir) {
            this.face += dir;
            if (this.face == -1)
                this.face = 3;
            if (this.face == 4)
                this.face = 0;

            switch (this.face) {
                case 0:
                    this.Forward = new LowRezJam.Point(0, -1);
                    this.Left = new LowRezJam.Point(-1, 0);
                    break;
                case 1:
                    this.Forward = new LowRezJam.Point(1, 0);
                    this.Left = new LowRezJam.Point(0, -1);
                    break;
                case 2:
                    this.Forward = new LowRezJam.Point(0, 1);
                    this.Left = new LowRezJam.Point(1, 0);
                    break;
                case 3:
                    this.Forward = new LowRezJam.Point(-1, 0);
                    this.Left = new LowRezJam.Point(0, 1);
                    break;
            }
        };

        Hero.prototype.GetLoc = function (l, f) {
            return new LowRezJam.Point(this.Position.X + ((f * this.Forward.X) + (l * this.Left.X)), this.Position.Y + ((f * this.Forward.Y) + (l * this.Left.Y)));
        };
        return Hero;
    })();
    LowRezJam.Hero = Hero;
})(LowRezJam || (LowRezJam = {}));
//# sourceMappingURL=hero.js.map
