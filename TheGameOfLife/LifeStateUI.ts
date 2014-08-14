///<reference path="references.ts"/>

class LifeStateUI {
    model: LifeStateModel;
    intervalID: number = -1;
    defaultColorWrapper: LifeColorWrapper = new LifeColorWrapper();
    deadColorWrapper: LifeColorWrapper = new LifeColorWrapper();
    bgColor: string = "rgb(255,255,255)";

    constructor(public cellPx: number, public ctx: CanvasRenderingContext2D, public canv: HTMLCanvasElement) {
        this.model = new LifeStateModel();
        this.deadColorWrapper.youngR = 0;
        this.deadColorWrapper.youngG = 0;
        this.deadColorWrapper.youngB = 0;
        this.deadColorWrapper.oldR = 255;
        this.deadColorWrapper.oldG = 255;
        this.deadColorWrapper.oldB = 255;
        this.deadColorWrapper.resetColors();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);
        var boolGrid: boolean[][];
        if (this.model.currGridOne)
            boolGrid = this.model.gridOne;
        else
            boolGrid = this.model.gridTwo;

        for (var i = 0; i < this.model.height; i++) {
            for (var j = 0; j < this.model.width; j++) {
                if (boolGrid[i][j]) {
                    this.setColorForAge(i, j);
                    this.ctx.fillRect(i * this.cellPx, j * this.cellPx, this.cellPx, this.cellPx);
                }
                else {
                    this.setColorForAge(i, j);
                    this.ctx.fillRect(i * this.cellPx, j * this.cellPx, this.cellPx, this.cellPx);
                }
            }
        }
    }

    private setColorForAge(i: number, j: number) {
        var age: number = this.model.ageGrid[i][j];
        if (age > 0)
            this.ctx.fillStyle = this.defaultColorWrapper.lerpColors[age - 1];
        else
            this.ctx.fillStyle = this.deadColorWrapper.lerpColors[(age * -1) - 1];
    }

    reset() {
        this.intervalID = -1;
        this.defaultColorWrapper.resetColors();
        var horizontalCells = this.canv.width / this.cellPx;
        var verticalCells = this.canv.height / this.cellPx;
        this.model.reset(verticalCells, horizontalCells);
    }

    run() {
        this.model.update();
        this.draw();
    }
}