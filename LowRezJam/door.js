var LowRezJam;
(function (LowRezJam) {
    var Door = (function () {
        function Door(pos) {
            this.opening = false;
            this.closing = false;
            this.Position = pos;
            this.Open = false;
            this.OpenAmount = 0;
        }
        Door.prototype.Update = function (time) {
            if (this.opening) {
                if (this.OpenAmount < 31)
                    this.OpenAmount++;
                else {
                    this.Open = true;
                    this.opening = false;
                }
            }

            if (this.closing) {
                if (this.OpenAmount > 0)
                    this.OpenAmount--;
                else {
                    this.Open = false;
                    this.closing = false;
                }
            }
        };

        Door.prototype.Clicked = function (pos) {
            if (this.opening || this.closing)
                return;

            if (this.Open) {
                this.closing = true;
                this.Open = false;
            } else
                this.opening = true;
        };
        return Door;
    })();
    LowRezJam.Door = Door;
})(LowRezJam || (LowRezJam = {}));
//# sourceMappingURL=door.js.map
