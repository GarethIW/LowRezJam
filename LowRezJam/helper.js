var LowRezJam;
(function (LowRezJam) {
    var Helper = (function () {
        function Helper() {
        }
        Helper.getFrame = function (game, x, y) {
            return (20 * y) + x;
        };
        return Helper;
    })();
    LowRezJam.Helper = Helper;
})(LowRezJam || (LowRezJam = {}));
//# sourceMappingURL=helper.js.map
