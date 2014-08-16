///<reference path="references.ts"/>

class LifeColorStateWrapper {
    lerpColors: string[];
    oldColor: LifeRGBColor;
    youngColor: LifeRGBColor;
    steps: number;

    constructor() {
        this.oldColor = new LifeRGBColor();
        this.youngColor = new LifeRGBColor();
    }

    public resetColors(): void {
        this.lerpColors = [];
        for (var i: number = 0; i < this.steps; i++) {
            this.lerpColors[i] = this.lerpColor(i);
        }
    }

    private lerpColor(currStep: number): string {
        var t: number = currStep / this.steps;

        var red: number = Math.round(this.lerp(this.youngColor.red, this.oldColor.red, t));
        var green: number = Math.round(this.lerp(this.youngColor.green, this.oldColor.green, t));
        var blue: number = Math.round(this.lerp(this.youngColor.blue, this.oldColor.blue, t));

        return "rgb(" + red + ", " + green + ", " + blue + ")";
    }

    private lerp(v0: number, v1: number, t: number): number {
        return (1 - t) * v0 + t * v1;
    }
} 