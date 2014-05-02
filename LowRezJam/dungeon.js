﻿var LowRezJam;
(function (LowRezJam) {
    var Dungeon = (function () {
        function Dungeon() {
            this.Tiles = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
                [1, 0, 1, 2, 1, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ];

            for (var y = 0; y < this.Tiles.length; y++)
                for (var x = 0; x < this.Tiles[y].length; x++)
                    if (this.Tiles[y][x] == 2) {
                        this.Tiles[y][x] = 0;
                        this.Spawn = new LowRezJam.Point(x, y);
                    }
        }
        return Dungeon;
    })();
    LowRezJam.Dungeon = Dungeon;
})(LowRezJam || (LowRezJam = {}));
//# sourceMappingURL=dungeon.js.map
