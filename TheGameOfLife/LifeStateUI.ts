///<reference path="references.ts"/>

class LifeStateUI {
    model: LifeStateModel;
    intervalID: number = -1;
    lifeColorWrapper: LifeColorStateWrapper = new LifeColorStateWrapper();
    deathColorWrapper: LifeColorStateWrapper = new LifeColorStateWrapper();
    bgColor: string = "rgb(255,255,255)";

    constructor(public cellPx: number, public ctx: CanvasRenderingContext2D, public canv: HTMLCanvasElement) {
        this.model = new LifeStateModel();
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
                this.setColorForAge(i, j);
                this.ctx.fillRect(i * this.cellPx, j * this.cellPx, this.cellPx, this.cellPx);
            }
        }
    }

    private setColorForAge(i: number, j: number) {
        var age: number = this.model.ageGrid[i][j];
        if (age > 0)
            this.ctx.fillStyle = this.lifeColorWrapper.lerpColors[age - 1];
        else
            this.ctx.fillStyle = this.deathColorWrapper.lerpColors[(age * -1)];
    }

    reset() {
        this.intervalID = -1;
        this.lifeColorWrapper.resetColors();
        this.deathColorWrapper.resetColors();
        var horizontalCells = this.canv.width / this.cellPx;
        var verticalCells = this.canv.height / this.cellPx;
        this.model.reset(verticalCells, horizontalCells);
    }

    run() {
        this.model.update();
        this.draw();
    }
}