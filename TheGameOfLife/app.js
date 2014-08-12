var LifeRules = (function () {
    function LifeRules() {
    }
    LifeRules.setSurvivalBirthStates = function (inputString) {
        var survivalBirthArray = inputString.split('/');
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
    };

    LifeRules.getSurvivalStates = function () {
        return this.survivalStates;
    };

    LifeRules.getBirthStates = function () {
        return this.birthStates;
    };

    LifeRules.setMaxAge = function (newMax) {
        this.maxAge = newMax;
    };

    LifeRules.getMaxAge = function () {
        return this.maxAge;
    };

    LifeRules.setLivingStartOdds = function (newOdds) {
        this.livingStartOdds = newOdds;
    };

    LifeRules.getLivingStartOdds = function () {
        return this.livingStartOdds;
    };
    return LifeRules;
})();

var LifeStateModel = (function () {
    function LifeStateModel(width, height) {
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
                this.gridOne[i][j] = Math.random() < LifeRules.getLivingStartOdds();
                this.gridTwo[i][j] = false;
                this.ageGrid[i][j] = 0;
            }
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

        if (newState && age < LifeRules.getMaxAge())
            this.ageGrid[i][j]++; // = this.ageGrid[i][j] + 1;
        else if (!newState && oldState)
            this.ageGrid[i][j] = 0;

        this.setState(i, j, newState, !this.currGridOne);
    };

    LifeStateModel.prototype.getNewCellState = function (i, j) {
        var sumOfNeighbors = this.sumNeighborsOf(i, j);
        if (this.getCurrState(i, j))
            return LifeRules.getSurvivalStates().indexOf(sumOfNeighbors) != -1;
        else
            return LifeRules.getBirthStates().indexOf(sumOfNeighbors) != -1;
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
    function LifeStateUI(width, height, ctx, canv, cellSizePX) {
        this.ctx = ctx;
        this.canv = canv;
        this.cellSizePX = cellSizePX;
        this.intervalID = -1;
        this.defaultColorWrapper = new LifeColorWrapper(69, 11, 187, 235, 0, 63, LifeRules.getMaxAge());
        this.model = new LifeStateModel(width, height);
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
        this.ctx.fillStyle = this.defaultColorWrapper.lerpColors[age - 1];
    };

    LifeStateUI.prototype.run = function () {
        this.model.update();
        this.draw();
    };
    return LifeStateUI;
})();

var LifeColorWrapper = (function () {
    function LifeColorWrapper(oldR, oldG, oldB, youngR, youngG, youngB, steps) {
        this.steps = steps;
        this.lerpColors = [];
        for (var i = 0; i < steps; i++) {
            this.lerpColors[i] = this.lerpColor(oldR, oldG, oldB, youngR, youngG, youngB, i);
        }
    }
    LifeColorWrapper.prototype.lerpColor = function (oldR, oldG, oldB, youngR, youngG, youngB, currStep) {
        var t = currStep / this.steps;

        var red = Math.round(this.lerp(youngR, oldR, t));
        var green = Math.round(this.lerp(youngG, oldG, t));
        var blue = Math.round(this.lerp(youngB, oldB, t));

        return "rgb(" + red + ", " + green + ", " + blue + ")";
    };

    LifeColorWrapper.prototype.lerp = function (v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    };
    return LifeColorWrapper;
})();

window.onload = function () {
    var canv;
    canv = document.getElementById('gameCanvas');
    canv.style.border = "1px solid gray";

    var ctx;
    ctx = canv.getContext("2d");
    ctx.fillStyle = "rgb(200,0,0)";

    canv.width = window.innerWidth - 20;
    canv.height = window.innerHeight - 100;

    var cellPx = Number(getValue('txtCellPixels'));
    var horizontalCells = canv.width / cellPx;
    var verticalCells = canv.height / cellPx;

    LifeRules.setSurvivalBirthStates(getValue('txtSurvivalBirth'));
    LifeRules.setMaxAge(Number(getValue('txtMaxAge')));
    LifeRules.setLivingStartOdds(Number(getValue('txtStartingLiveOdds')));

    var lifeUI = new LifeStateUI(verticalCells, horizontalCells, ctx, canv, cellPx);
    lifeUI.draw();

    var btnStartStop = document.getElementById('btnStartStop');
    btnStartStop.onclick = function () {
        if (lifeUI.intervalID == -1) {
            LifeRules.setSurvivalBirthStates(getValue('txtSurvivalBirth'));
            LifeRules.setMaxAge(Number(getValue('txtMaxAge')));
            LifeRules.setLivingStartOdds(Number(getValue('txtStartingLiveOdds')));

            btnStartStop.innerHTML = "Stop";
            lifeUI.intervalID = setInterval(function () {
                lifeUI.run();
            }, 1000 / Number(getValue('txtSpeed')));
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
        LifeRules.setSurvivalBirthStates(getValue('txtSurvivalBirth'));
        LifeRules.setMaxAge(Number(getValue('txtMaxAge')));
        LifeRules.setLivingStartOdds(Number(getValue('txtStartingLiveOdds')));
        lifeUI = new LifeStateUI(verticalCells, horizontalCells, ctx, canv, cellPx);
        lifeUI.draw();
        btnStartStop.innerHTML = "Start";
    };
};

function getValue(inputName) {
    return document.getElementById(inputName).value;
}
//# sourceMappingURL=app.js.map
