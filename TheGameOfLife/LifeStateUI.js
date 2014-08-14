///<reference path="references.ts"/>
var LifeStateUI = (function () {
    function LifeStateUI(cellPx, ctx, canv) {
        this.cellPx = cellPx;
        this.ctx = ctx;
        this.canv = canv;
        this.intervalID = -1;
        this.defaultColorWrapper = new LifeColorWrapper();
        this.deadColorWrapper = new LifeColorWrapper();
        this.bgColor = "rgb(255,255,255)";
        this.model = new LifeStateModel();
        this.deadColorWrapper.youngR = 0;
        this.deadColorWrapper.youngG = 0;
        this.deadColorWrapper.youngB = 0;
        this.deadColorWrapper.oldR = 255;
        this.deadColorWrapper.oldG = 255;
        this.deadColorWrapper.oldB = 255;
        this.deadColorWrapper.resetColors();
    }
    LifeStateUI.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);
        var boolGrid;
        if (this.model.currGridOne)
            boolGrid = this.model.gridOne;
        else
            boolGrid = this.model.gridTwo;

        for (var i = 0; i < this.model.height; i++) {
            for (var j = 0; j < this.model.width; j++) {
                if (boolGrid[i][j]) {
                    this.setColorForAge(i, j);
                    this.ctx.fillRect(i * this.cellPx, j * this.cellPx, this.cellPx, this.cellPx);
                } else {
                    this.setColorForAge(i, j);
                    this.ctx.fillRect(i * this.cellPx, j * this.cellPx, this.cellPx, this.cellPx);
                }
            }
        }
    };

    LifeStateUI.prototype.setColorForAge = function (i, j) {
        var age = this.model.ageGrid[i][j];
        if (age > 0)
            this.ctx.fillStyle = this.defaultColorWrapper.lerpColors[age - 1];
        else
            this.ctx.fillStyle = this.deadColorWrapper.lerpColors[(age * -1) - 1];
    };

    LifeStateUI.prototype.reset = function () {
        this.intervalID = -1;
        this.defaultColorWrapper.resetColors();
        var horizontalCells = this.canv.width / this.cellPx;
        var verticalCells = this.canv.height / this.cellPx;
        this.model.reset(verticalCells, horizontalCells);
    };

    LifeStateUI.prototype.run = function () {
        this.model.update();
        this.draw();
    };
    return LifeStateUI;
})();
//# sourceMappingURL=LifeStateUI.js.map
