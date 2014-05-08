var LowRezJam;
(function (LowRezJam) {
    var Mob = (function () {
        function Mob(dungeon, spawn) {
            this.Face = 0;
            this.Position = spawn;
            this.Forward = new LowRezJam.Point(0, -1);
            this.Left = new LowRezJam.Point(-1, 0);

            this.dungeon = dungeon;
        }
        Mob.prototype.MoveForward = function () {
            this.TryMove(0, 1);
        };

        Mob.prototype.MoveBackward = function () {
            this.TryMove(0, -1);
        };

        Mob.prototype.MoveLeft = function () {
            this.TryMove(1, 0);
        };

        Mob.prototype.MoveRight = function () {
            this.TryMove(-1, 0);
        };

        Mob.prototype.TurnLeft = function () {
            this.DoTurn(-1);
        };

        Mob.prototype.TurnRight = function () {
            this.DoTurn(1);
        };

        Mob.prototype.CalcFrame = function (heroFace) {
            var f = this.Face - heroFace;
            if (f < 0)
                f = 4 + f;

            return f;
        };

        Mob.prototype.TryMove = function (l, f) {
            var loc = this.GetLoc(l, f);

            if (this.dungeon.Tiles[loc.Y][loc.X] == 1)
                this.Position = loc;

            if (this.dungeon.Tiles[loc.Y][loc.X] == 3)
                for (var d = 0; d < crawlergame.dungeon.Doors.length; d++)
                    if (crawlergame.dungeon.Doors[d].Position.X == loc.X && crawlergame.dungeon.Doors[d].Position.Y == loc.Y && crawlergame.dungeon.Doors[d].Open)
                        this.Position = loc;
        };

        Mob.prototype.DoTurn = function (dir) {
            this.Face += dir;
            if (this.Face == -1)
                this.Face = 3;
            if (this.Face == 4)
                this.Face = 0;

            switch (this.Face) {
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

        Mob.prototype.GetLoc = function (l, f) {
            return new LowRezJam.Point(this.Position.X + ((f * this.Forward.X) + (l * this.Left.X)), this.Position.Y + ((f * this.Forward.Y) + (l * this.Left.Y)));
        };
        return Mob;
    })();
    LowRezJam.Mob = Mob;
})(LowRezJam || (LowRezJam = {}));
//# sourceMappingURL=mob.js.map
