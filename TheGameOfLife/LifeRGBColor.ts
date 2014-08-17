///<reference path="references.ts"/>

class LifeRGBColor {
    red: number;
    blue: number;
    green: number;

    initFromHex(hex: string): void {
        if (hex.indexOf("#") != -1)
            hex = hex.substring(1, hex.length);

        var bigInt = parseInt(hex, 16);
        this.red = (bigInt >> 16) & 255;
        this.green = (bigInt >> 8) & 255;
        this.blue = bigInt & 255;
    }
}