﻿var LowRezJam;
(function (LowRezJam) {
    var Helper = (function () {
        function Helper() {
        }
        Helper.getFrame = function (game, x, y) {
            return (10 * y) + x;
        };
        return Helper;
    })();
    LowRezJam.Helper = Helper;
})(LowRezJam || (LowRezJam = {}));
//# sourceMappingURL=helper.js.map