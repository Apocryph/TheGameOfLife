///<reference path="references.ts"/>
var LifeColorStateWrapper = (function () {
    function LifeColorStateWrapper() {
        this.oldColor = new LifeRGBColor();
        this.youngColor = new LifeRGBColor();
    }
    LifeColorStateWrapper.prototype.resetColors = function () {
        this.lerpColors = [];
        for (var i = 0; i < this.steps; i++) {
            this.lerpColors[i] = this.lerpColor(i);
        }
    };

    LifeColorStateWrapper.prototype.lerpColor = function (currStep) {
        var t = currStep / this.steps;

        var red = Math.round(this.lerp(this.youngColor.red, this.oldColor.red, t));
        var green = Math.round(this.lerp(this.youngColor.green, this.oldColor.green, t));
        var blue = Math.round(this.lerp(this.youngColor.blue, this.oldColor.blue, t));

        return "rgb(" + red + ", " + green + ", " + blue + ")";
    };

    LifeColorStateWrapper.prototype.lerp = function (v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    };
    return LifeColorStateWrapper;
})();
//# sourceMappingURL=LifeColorStateWrapper.js.map
