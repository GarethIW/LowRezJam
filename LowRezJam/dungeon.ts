module LowRezJam {

    export class Dungeon {

        public Width: number;
        public Height: number;
        public Tiles: number[][];
        public Spawn: Point;
        public Doors: Door[];

        private rooms: Room[];
        private maxRooms = 15;
        private maxRoomSize = 8;
        private possibleDoorLocations = [];

        private rnd: Phaser.RandomDataGenerator;

        constructor(width: number, height: number, game: Phaser.Game) {
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
        }

        Generate() {
            var maxTries = 15;
            var tries = 0;

            // Create rooms
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

            // Place rooms in map
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

            // Generate coridoors
            for (var i = 1; i < this.rooms.length; i++) {
                var firstExit = new Point(this.rooms[i].Left + this.rooms[i].Exit.X, this.rooms[i].Top + this.rooms[i].Exit.Y);
                var secondExit = new Point(this.rooms[i - 1].Left + this.rooms[i - 1].Exit.X, this.rooms[i - 1].Top + this.rooms[i - 1].Exit.Y);

                //Horizontal Corridors
                if ((secondExit.X - firstExit.X) > 0) {
                    //Corridor going left
                    for (var c = secondExit.X; c >= firstExit.X; c--) {
                        this.GenerateHorizontalCorridor(c, secondExit.Y);
                    }
                } else {
                    //Corridor going right
                    for (var c = secondExit.X; c <= firstExit.X; c++) {
                        this.GenerateHorizontalCorridor(c, secondExit.Y);
                    }
                }

                //Vertical Corridors
                if ((secondExit.Y - firstExit.Y) > 0) {
                    //If the corridor is going up
                    for (var c = secondExit.Y; c >= firstExit.Y; c--) {
                        this.GenerateVerticalCorridor(firstExit.X, c);
                    }
                } else {
                    //If the corridor is going down
                    for (var c = secondExit.Y; c <= firstExit.Y; c++) {
                        this.GenerateVerticalCorridor(firstExit.X, c);
                    }
                }
            }

            for (var i = 0; i < this.possibleDoorLocations.length; i++) {
                if (this.rnd.integerInRange(0, 5) == 0) {
                    this.Tiles[this.possibleDoorLocations[i].Y][this.possibleDoorLocations[i].X] = 3;
                    this.Doors.push(new Door(new Point(this.possibleDoorLocations[i].X, this.possibleDoorLocations[i].Y)));
                }
            }

            var startRoom = this.rnd.integerInRange(0, this.rooms.length - 1);
            this.Spawn = this.rooms[startRoom].GetRandomPosition(this.rnd);
        }

        GenerateHorizontalCorridor(x:number,y:number) {
            var currentTile = this.Tiles[y][x];

            var aboveTile = this.Tiles[y-1][x];
            var belowTile = this.Tiles[y+1][x];

            //If the current tile type is a wall, and the tiles above and below here are also walls
            //this may be a possible door location
            if (currentTile === 2 && aboveTile === 2 && belowTile === 2) this.possibleDoorLocations.push(new Point(x,y));

            this.Tiles[y][x] = 1;

            if (aboveTile === 0) {
                this.Tiles[y - 1][x]=2;
            }

            if (belowTile === 0) {
                this.Tiles[y + 1][x] = 2;
            }
        }

        GenerateVerticalCorridor(x: number, y: number) {
            var currentTile = this.Tiles[y][x];

            var rightTile = this.Tiles[y][x + 1];
            var leftTile = this.Tiles[y][x-1];

            //If the current tile type is a wall, and the tiles above and below here are also walls
            //this may be a possible door location
            if (currentTile === 2 && rightTile === 2 && leftTile === 2) this.possibleDoorLocations.push(new Point(x, y));

            this.Tiles[y][x] = 1;

            if (rightTile === 0) {
                this.Tiles[y][x+1] = 2;
            }

            if (leftTile === 0) {
                this.Tiles[y][x-1] = 2;
            }
        }

        RoomIntersectsWith(room) : boolean {
            for (var i = 0; i < this.rooms.length; i++) {
                if (room.Left <= this.rooms[i].Right && room.Right >= this.rooms[i].Left && room.Top <= this.rooms[i].Bottom && room.Bottom >= this.rooms[i].Top) {
                    return true;
                }

            }

            return false;
        }

        GetString() : string {
            var map = "";
            for (var y = 0; y < this.Height; y++) {
                for (var x = 0; x < this.Width; x++)
                    map += this.Tiles[y][x];
                map += "\n";
            }
            return map;
        }

    }

    export class Room {

        public Left: number;
        public Right: number;
        public Top: number;
        public Bottom: number;
        public Width: number;
        public Height: number;

        public Tiles = [];

        public Exit: Point;

        constructor(l: number, t: number, w: number, h: number, rnd:Phaser.RandomDataGenerator) {
            this.Left = l;
            this.Right = l + w;
            this.Top = t;
            this.Bottom = t + h;
            this.Width = w;
            this.Height = h;

            // Generate walls
            for (var y = 0; y < this.Height; y++) {
                this.Tiles[y] = [];
                for (var x = 0; x < this.Width; x++) {
                    if (y === 0 || y === this.Height - 1 || x === 0 || x === this.Width - 1) {
                        this.Tiles[y][x] = 2;
                    }
                    else {
                        this.Tiles[y][x] = 1;
                    }
                }
            }

            // Make an exit
            switch (rnd.integerInRange(1, 4)) {

                case 1: //Top
                    this.Exit = new Point(rnd.integerInRange(1, this.Width - 2), this.Height - 2);
                    break;


                case 2: //Bottom
                    this.Exit = new Point(rnd.integerInRange(1, this.Width - 2), 1);
                    break;

                case 3: //Left
                    this.Exit = new Point(this.Width - 2, rnd.integerInRange(1, this.Height - 2));
                    break;

                case 4: //Right
                    this.Exit = new Point(1, rnd.integerInRange(1, this.Height - 2));
                    break;
            }


        }

        public GetRandomPosition(rnd:Phaser.RandomDataGenerator): Point {
            var positionX = rnd.integerInRange(2, this.Width - 3);
            var positionY = rnd.integerInRange(2, this.Height - 3);

            positionX += this.Left;
            positionY += this.Top;

            return new Point(positionX, positionY);
        }


    }

}