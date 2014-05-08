var LowRezJam;
(function (LowRezJam) {
    var Dungeon = (function () {
        function Dungeon(width, height, game, mobs) {
            this.maxRooms = 15;
            this.maxRoomSize = 8;
            this.possibleDoorLocations = [];
            //this.Tiles = [
            //    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            //    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
            //    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            //    [1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
            //    [1, 0, 1, 2, 1, 0, 0, 0, 0, 1],
            //    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            //];
            this.Width = width;
            this.Height = height;
            this.rnd = game.rnd;

            this.Tiles = [[]];
            this.Doors = [];
            this.rooms = [];

            for (var y = 0; y < this.Height; y++) {
                this.Tiles[y] = [];
                for (var x = 0; x < this.Width; x++)
                    this.Tiles[y][x] = 0;
            }

            this.Generate();

            for (var m = 0; m < 10; m++) {
                var room = this.rnd.integerInRange(0, this.rooms.length - 1);
                mobs.push(new LowRezJam.Mob(this, new LowRezJam.Point(this.rooms[room].Left + 1 + this.rnd.integerInRange(0, this.rooms[room].Width - 2), this.rooms[room].Top + 1 + this.rnd.integerInRange(0, this.rooms[room].Height - 2))));
            }
        }
        Dungeon.prototype.Generate = function () {
            var maxTries = 15;
            var tries = 0;

            while (this.rooms.length < this.maxRooms) {
                if (tries >= maxTries) {
                    break;
                }

                var rw = this.rnd.integerInRange(4, this.maxRoomSize);
                var rh = this.rnd.integerInRange(4, this.maxRoomSize);

                var rx = this.rnd.integerInRange(1, this.Width - rw - 1);
                var ry = this.rnd.integerInRange(1, this.Height - rh - 1);

                var room = new Room(rx, ry, rw, rh, this.rnd);

                tries++;

                if (!this.RoomIntersectsWith(room)) {
                    this.rooms.push(room);
                    tries = 0;
                }
            }

            for (var i = 0; i < this.rooms.length; i++) {
                for (var x = this.rooms[i].Left; x < this.rooms[i].Right; x++) {
                    var layoutXPos = this.rooms[i].Right - x - 1;
                    for (var y = this.rooms[i].Top; y < this.rooms[i].Bottom; y++) {
                        var layoutYPos = this.rooms[i].Bottom - y - 1;
                        var currentTile = this.rooms[i].Tiles[layoutYPos][layoutXPos];
                        this.Tiles[y][x] = currentTile;
                    }
                }
            }

            for (var i = 1; i < this.rooms.length; i++) {
                var firstExit = new LowRezJam.Point(this.rooms[i].Left + this.rooms[i].Exit.X, this.rooms[i].Top + this.rooms[i].Exit.Y);
                var secondExit = new LowRezJam.Point(this.rooms[i - 1].Left + this.rooms[i - 1].Exit.X, this.rooms[i - 1].Top + this.rooms[i - 1].Exit.Y);

                //Horizontal Corridors
                if ((secondExit.X - firstExit.X) > 0) {
                    for (var c = secondExit.X; c >= firstExit.X; c--) {
                        this.GenerateHorizontalCorridor(c, secondExit.Y);
                    }
                } else {
                    for (var c = secondExit.X; c <= firstExit.X; c++) {
                        this.GenerateHorizontalCorridor(c, secondExit.Y);
                    }
                }

                //Vertical Corridors
                if ((secondExit.Y - firstExit.Y) > 0) {
                    for (var c = secondExit.Y; c >= firstExit.Y; c--) {
                        this.GenerateVerticalCorridor(firstExit.X, c);
                    }
                } else {
                    for (var c = secondExit.Y; c <= firstExit.Y; c++) {
                        this.GenerateVerticalCorridor(firstExit.X, c);
                    }
                }
            }

            for (var i = 0; i < this.possibleDoorLocations.length; i++) {
                if (this.rnd.integerInRange(0, 4) == 0) {
                    // Need to check surrounding tiles for walls as they may have changed since adding possible location
                    // Two walls is number we're looking for!
                    var count = 0;
                    if (this.Tiles[this.possibleDoorLocations[i].Y - 1][this.possibleDoorLocations[i].X] == 2)
                        count++;
                    if (this.Tiles[this.possibleDoorLocations[i].Y + 1][this.possibleDoorLocations[i].X] == 2)
                        count++;
                    if (this.Tiles[this.possibleDoorLocations[i].Y][this.possibleDoorLocations[i].X - 1] == 2)
                        count++;
                    if (this.Tiles[this.possibleDoorLocations[i].Y][this.possibleDoorLocations[i].X + 1] == 2)
                        count++;
                    if (count == 2) {
                        this.Tiles[this.possibleDoorLocations[i].Y][this.possibleDoorLocations[i].X] = 3;
                        this.Doors.push(new LowRezJam.Door(new LowRezJam.Point(this.possibleDoorLocations[i].X, this.possibleDoorLocations[i].Y)));
                    }
                }
            }

            var startRoom = this.rnd.integerInRange(0, this.rooms.length - 1);
            this.Spawn = this.rooms[startRoom].GetRandomPosition(this.rnd);
        };

        Dungeon.prototype.GenerateHorizontalCorridor = function (x, y) {
            var currentTile = this.Tiles[y][x];

            var aboveTile = this.Tiles[y - 1][x];
            var belowTile = this.Tiles[y + 1][x];

            //If the current tile type is a wall, and the tiles above and below here are also walls
            //this may be a possible door location
            if (currentTile === 2 && aboveTile === 2 && belowTile === 2)
                this.possibleDoorLocations.push(new LowRezJam.Point(x, y));

            this.Tiles[y][x] = 1;

            if (aboveTile === 0) {
                this.Tiles[y - 1][x] = 2;
            }

            if (belowTile === 0) {
                this.Tiles[y + 1][x] = 2;
            }
        };

        Dungeon.prototype.GenerateVerticalCorridor = function (x, y) {
            var currentTile = this.Tiles[y][x];

            var rightTile = this.Tiles[y][x + 1];
            var leftTile = this.Tiles[y][x - 1];

            //If the current tile type is a wall, and the tiles above and below here are also walls
            //this may be a possible door location
            if (currentTile === 2 && rightTile === 2 && leftTile === 2)
                this.possibleDoorLocations.push(new LowRezJam.Point(x, y));

            this.Tiles[y][x] = 1;

            if (rightTile === 0) {
                this.Tiles[y][x + 1] = 2;
            }

            if (leftTile === 0) {
                this.Tiles[y][x - 1] = 2;
            }
        };

        Dungeon.prototype.RoomIntersectsWith = function (room) {
            for (var i = 0; i < this.rooms.length; i++) {
                if (room.Left <= this.rooms[i].Right && room.Right >= this.rooms[i].Left && room.Top <= this.rooms[i].Bottom && room.Bottom >= this.rooms[i].Top) {
                    return true;
                }
            }

            return false;
        };

        Dungeon.prototype.GetString = function () {
            var map = "";
            for (var y = 0; y < this.Height; y++) {
                for (var x = 0; x < this.Width; x++)
                    map += this.Tiles[y][x];
                map += "\n";
            }
            return map;
        };
        return Dungeon;
    })();
    LowRezJam.Dungeon = Dungeon;

    var Room = (function () {
        function Room(l, t, w, h, rnd) {
            this.Tiles = [];
            this.Left = l;
            this.Right = l + w;
            this.Top = t;
            this.Bottom = t + h;
            this.Width = w;
            this.Height = h;

            for (var y = 0; y < this.Height; y++) {
                this.Tiles[y] = [];
                for (var x = 0; x < this.Width; x++) {
                    if (y === 0 || y === this.Height - 1 || x === 0 || x === this.Width - 1) {
                        this.Tiles[y][x] = 2;
                    } else {
                        this.Tiles[y][x] = 1;
                    }
                }
            }

            switch (rnd.integerInRange(1, 4)) {
                case 1:
                    this.Exit = new LowRezJam.Point(rnd.integerInRange(1, this.Width - 2), this.Height - 2);
                    break;

                case 2:
                    this.Exit = new LowRezJam.Point(rnd.integerInRange(1, this.Width - 2), 1);
                    break;

                case 3:
                    this.Exit = new LowRezJam.Point(this.Width - 2, rnd.integerInRange(1, this.Height - 2));
                    break;

                case 4:
                    this.Exit = new LowRezJam.Point(1, rnd.integerInRange(1, this.Height - 2));
                    break;
            }
        }
        Room.prototype.GetRandomPosition = function (rnd) {
            var positionX = rnd.integerInRange(2, this.Width - 3);
            var positionY = rnd.integerInRange(2, this.Height - 3);

            positionX += this.Left;
            positionY += this.Top;

            return new LowRezJam.Point(positionX, positionY);
        };
        return Room;
    })();
    LowRezJam.Room = Room;
})(LowRezJam || (LowRezJam = {}));
//# sourceMappingURL=dungeon.js.map
