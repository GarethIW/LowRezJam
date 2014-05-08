var LowRezJam;
(function (LowRezJam) {
    var Helper = (function () {
        function Helper() {
        }
        Helper.getFrame = function (game, x, y) {
            return (21 * y) + x;
        };

        Helper.getScale = function (f, s) {
            switch (f) {
                case 1:
                    return new Phaser.Point(0.94 * s, 0.94 * s);
                case 2:
                    return new Phaser.Point(Math.floor(0.5 * s), Math.floor(0.5 * s));
                case 3:
                    return new Phaser.Point(Math.floor(0.22 * s), Math.floor(0.22 * s));
                default:
                    return new Phaser.Point(Math.floor(0 * s), Math.floor(0 * s));
            }
        };
        return Helper;
    })();
    LowRezJam.Helper = Helper;
})(LowRezJam || (LowRezJam = {}));
//# sourceMappingURL=helper.js.map
