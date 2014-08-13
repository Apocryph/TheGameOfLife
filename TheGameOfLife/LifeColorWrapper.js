///<reference path="references.ts"/>
var LifeColorWrapper = (function () {
    function LifeColorWrapper() {
        this.resetColors();
    }
    LifeColorWrapper.prototype.resetColors = function () {
        this.lerpColors = [];
        for (var i = 0; i < LifeRules.getMaxAge(); i++) {
            this.lerpColors[i] = this.lerpColor(i);
        }
    };

    LifeColorWrapper.prototype.lerpColor = function (currStep) {
        var t = currStep / LifeRules.getMaxAge();

        var red = Math.round(this.lerp(this.youngR, this.oldR, t));
        var green = Math.round(this.lerp(this.youngG, this.oldG, t));
        var blue = Math.round(this.lerp(this.youngB, this.oldB, t));

        return "rgb(" + red + ", " + green + ", " + blue + ")";
    };

    LifeColorWrapper.prototype.lerp = function (v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    };
    return LifeColorWrapper;
})();
//# sourceMappingURL=LifeColorWrapper.js.map
