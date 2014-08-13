///<reference path="references.ts"/>

class LifeColorWrapper {
    lerpColors: string[];
    oldR: number;
    oldG: number;
    oldB: number;
    youngR: number;
    youngG: number;
    youngB: number;

    constructor() {
        this.resetColors();
    }

    public resetColors(): void {
        this.lerpColors = [];
        for (var i: number = 0; i < LifeRules.getMaxAge(); i++) {
            this.lerpColors[i] = this.lerpColor(i);
        }
    }

    private lerpColor(currStep: number): string {
        var t: number = currStep / LifeRules.getMaxAge();

        var red: number = Math.round(this.lerp(this.youngR, this.oldR, t));
        var green: number = Math.round(this.lerp(this.youngG, this.oldG, t));
        var blue: number = Math.round(this.lerp(this.youngB, this.oldB, t));

        return "rgb(" + red + ", " + green + ", " + blue + ")";
    }

    private lerp(v0: number, v1: number, t: number): number {
        return (1 - t) * v0 + t * v1;
    }
} 