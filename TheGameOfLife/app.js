var LifeStateModel = (function () {
    function LifeStateModel(width, height, survivalBirth) {
        this.width = width;
        this.height = height;
        this.currGridOne = true;
        this.gridOne = [];
        this.gridTwo = [];
        for (var i = 0; i < height; i++) {
            this.gridOne[i] = [];
            this.gridTwo[i] = [];
            for (var j = 0; j < width; j++) {
                this.gridOne[i][j] = Math.random() > 0.5;
                this.gridTwo[i][j] = false;
            }
        }

        var survivalBirthArray = survivalBirth.split('/');
        var survivalChars = survivalBirthArray[0].split('');
        var birthChars = survivalBirthArray[1].split('');

        this.survivalStates = [];
        for (var i = 0; i < survivalChars.length; i++) {
            this.survivalStates[i] = Number(survivalChars[i]);
        }

        this.birthStates = [];
        for (var i = 0; i < birthChars.length; i++) {
            this.birthStates[i] = Number(birthChars[i]);
        }
        //this.survivalStates = [2, 3];
        //this.birthStates = [3];
    }
    LifeStateModel.prototype.update = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.processIndex(i, j);
            }
        }
        this.currGridOne = !this.currGridOne;
    };

    LifeStateModel.prototype.processIndex = function (i, j) {
        if (this.currGridOne) {
            this.gridTwo[i][j] = this.getNewCellState(i, j);
        } else {
            this.gridOne[i][j] = this.getNewCellState(i, j);
        }
    };

    LifeStateModel.prototype.getNewCellState = function (i, j) {
        var sumOfNeighbors = this.sumNeighborsOf(i, j);
        if ((this.currGridOne && this.gridOne[i][j]) || (!this.currGridOne && this.gridTwo[i][j]))
            //return sumOfNeighbors >= 2 && sumOfNeighbors <= 3;
            return this.survivalStates.indexOf(sumOfNeighbors) != -1;
        else
            //return sumOfNeighbors == 3;
            return this.birthStates.indexOf(sumOfNeighbors) != -1;
    };

    LifeStateModel.prototype.sumNeighborsOf = function (i, j) {
        var sum = 0;
        for (var y = i - 1; y <= i + 1; y++) {
            for (var x = j - 1; x <= j + 1; x++) {
                if (y != i || x != j)
                    sum += this.getValueForNeighborAt(y, x);
            }
        }
        return sum;
    };

    LifeStateModel.prototype.getValueForNeighborAt = function (i, j) {
        if (i < 0 || i >= this.height)
            return 0;

        if (j < 0 || j >= this.width)
            return 0;

        if (this.currGridOne) {
            if (this.gridOne[i][j])
                return 1;
            return 0;
        }
        if (this.gridTwo[i][j])
            return 1;
        return 0;
    };
    return LifeStateModel;
})();

var LifeStateUI = (function () {
    function LifeStateUI(width, height, ctx, canv, cellSizePX, survivalBirth) {
        this.ctx = ctx;
        this.canv = canv;
        this.cellSizePX = cellSizePX;
        this.intervalID = -1;
        this.model = new LifeStateModel(width, height, survivalBirth);
    }
    LifeStateUI.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        var boolGrid;
        if (this.model.currGridOne)
            boolGrid = this.model.gridOne;
        else
            boolGrid = this.model.gridTwo;

        for (var i = 0; i < this.model.height; i++) {
            for (var j = 0; j < this.model.width; j++) {
                if (boolGrid[i][j]) {
                    this.ctx.fillRect(i * this.cellSizePX, j * this.cellSizePX, this.cellSizePX, this.cellSizePX);
                }
            }
        }
    };

    LifeStateUI.prototype.run = function () {
        this.model.update();
        this.draw();
    };
    return LifeStateUI;
})();

window.onload = function () {
    var canv;
    canv = document.getElementById('gameCanvas');
    canv.style.border = "1px solid gray";

    //canv.width = window.innerWidth;
    //canv.height = window.innerHeight;
    var ctx;
    ctx = canv.getContext("2d");
    ctx.fillStyle = "rgb(200,0,0)";

    var cellPx = 5;
    var horizontalCells = canv.width / cellPx;
    var verticalCells = canv.height / cellPx;

    var lifeUI = new LifeStateUI(verticalCells, horizontalCells, ctx, canv, cellPx, document.getElementById('txtSurvivalBirth').value);
    lifeUI.draw();

    var btnStartStop = document.getElementById('btnStartStop');
    btnStartStop.onclick = function () {
        if (lifeUI.intervalID == -1) {
            btnStartStop.innerHTML = "Stop";
            lifeUI.intervalID = setInterval(function () {
                lifeUI.run();
            }, 1000 / Number(document.getElementById('txtSpeed').value));
        } else {
            btnStartStop.innerHTML = "Start";
            clearInterval(lifeUI.intervalID);
            lifeUI.intervalID = -1;
        }
    };

    var btnStep = document.getElementById('btnStep');
    btnStep.onclick = function () {
        lifeUI.run();
    };

    var btnReset = document.getElementById('btnReset');
    btnReset.onclick = function () {
        if (lifeUI.intervalID != -1)
            clearInterval(lifeUI.intervalID);
        lifeUI = new LifeStateUI(verticalCells, horizontalCells, ctx, canv, cellPx, document.getElementById('txtSurvivalBirth').value);
        lifeUI.draw();
        btnStartStop.innerHTML = "Start";
    };
    //setInterval(function () { lifeUI.run(); }, 10);
};
//# sourceMappingURL=app.js.map
