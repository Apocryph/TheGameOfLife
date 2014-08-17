///<reference path="references.ts"/>
var LifeRGBColor = (function () {
    function LifeRGBColor() {
    }
    LifeRGBColor.prototype.initFromHex = function (hex) {
        if (hex.indexOf("#") != -1)
            hex = hex.substring(1, hex.length);

        var bigInt = parseInt(hex, 16);
        this.red = (bigInt >> 16) & 255;
        this.green = (bigInt >> 8) & 255;
        this.blue = bigInt & 255;
    };
    return LifeRGBColor;
})();
//# sourceMappingURL=LifeRGBColor.js.map
