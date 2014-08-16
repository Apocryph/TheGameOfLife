///<reference path="references.ts"/>
var LifeStateUI = (function () {
    function LifeStateUI(cellPx, ctx, canv) {
        this.cellPx = cellPx;
        this.ctx = ctx;
        this.canv = canv;
        this.intervalID = -1;
        this.lifeColorWrapper = new LifeColorStateWrapper();
        this.deathColorWrapper = new LifeColorStateWrapper();
        this.bgColor = "rgb(255,255,255)";
        this.model = new LifeStateModel();
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
                this.setColorForAge(i, j);
                this.ctx.fillRect(i * this.cellPx, j * this.cellPx, this.cellPx, this.cellPx);
            }
        }
    };

    LifeStateUI.prototype.setColorForAge = function (i, j) {
        var age = this.model.ageGrid[i][j];
        if (age > 0)
            this.ctx.fillStyle = this.lifeColorWrapper.lerpColors[age - 1];
        else
            this.ctx.fillStyle = this.deathColorWrapper.lerpColors[(age * -1)];
    };

    LifeStateUI.prototype.reset = function () {
        this.intervalID = -1;
        this.lifeColorWrapper.resetColors();
        this.deathColorWrapper.resetColors();
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
