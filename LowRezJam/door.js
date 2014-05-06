var LowRezJam;
(function (LowRezJam) {
    var Door = (function () {
        function Door(pos) {
            this.Position = pos;
            this.Open = false;
            this.OpenAmount = 0;
        }
        return Door;
    })();
    LowRezJam.Door = Door;
})(LowRezJam || (LowRezJam = {}));
//# sourceMappingURL=door.js.map
