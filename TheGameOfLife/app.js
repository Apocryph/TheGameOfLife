var LifeStateModel = (function () {
    function LifeStateModel(width, height, survivalBirth) {
        this.width = width;
        this.height = height;
        this.currGridOne = true;
        this.gridOne = [];
        this.gridTwo = [];
        this.ageGrid = [];
        for (var i = 0; i < height; i++) {
            this.gridOne[i] = [];
            this.gridTwo[i] = [];
            this.ageGrid[i] = [];
            for (var j = 0; j < width; j++) {
                this.gridOne[i][j] = Math.random() > 0.5;
                this.gridTwo[i][j] = false;
                this.ageGrid[i][j] = 0;
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
    }
    LifeStateModel.prototype.getCurrState = function (i, j) {
        if (this.currGridOne)
            return this.gridOne[i][j];
        return this.gridTwo[i][j];
    };

    LifeStateModel.prototype.setState = function (i, j, newState, forStateOne) {
        if (forStateOne)
            this.gridOne[i][j] = newState;
        else
            this.gridTwo[i][j] = newState;
    };

    LifeStateModel.prototype.update = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.processIndex(i, j);
            }
        }
        this.currGridOne = !this.currGridOne;
    };

    LifeStateModel.prototype.processIndex = function (i, j) {
        var newState = this.getNewCellState(i, j);
        var oldState = this.getCurrState(i, j);
        var age = this.ageGrid[i][j];

        if (newState && age < 3)
            this.ageGrid[i][j]++; // = this.ageGrid[i][j] + 1;
        else if (!newState && oldState)
            this.ageGrid[i][j] = 0;

        this.setState(i, j, newState, !this.currGridOne);
    };

    LifeStateModel.prototype.getNewCellState = function (i, j) {
        var sumOfNeighbors = this.sumNeighborsOf(i, j);
        if (this.getCurrState(i, j))
            return this.survivalStates.indexOf(sumOfNeighbors) != -1;
        else
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

        if (this.getCurrState(i, j))
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
                    this.setColorForAge(i, j);
                    this.ctx.fillRect(i * this.cellSizePX, j * this.cellSizePX, this.cellSizePX, this.cellSizePX);
                }
            }
        }
    };

    LifeStateUI.prototype.setColorForAge = function (i, j) {
        var age = this.model.ageGrid[i][j];
        var colorString;
        if (age == 3)
            colorString = "rgb(128,0,0)";
        else if (age == 2)
            colorString = "rgb(178,42,42)";
        else if (age == 1)
            colorString = "rgb(255,0,0)";
        else
            colorString = "rgb(0,255,0)";

        this.ctx.fillStyle = colorString;
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
};
