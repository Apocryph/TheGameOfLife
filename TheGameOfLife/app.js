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
    function LifeStateModel() {
        this.currGridOne = true;
    }
    LifeStateModel.prototype.reset = function (newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
        this.resetGrid();
    };

    LifeStateModel.prototype.resetGrid = function () {
        this.currGridOne = true;
        this.gridOne = [];
        this.gridTwo = [];
        this.ageGrid = [];
        for (var i = 0; i < this.height; i++) {
            this.gridOne[i] = [];
            this.gridTwo[i] = [];
            this.ageGrid[i] = [];
            for (var j = 0; j < this.width; j++) {
                this.gridOne[i][j] = Math.random() < LifeRules.getLivingStartOdds();
                this.gridTwo[i][j] = false;
                this.ageGrid[i][j] = 0;
            }
        }
    };

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
    function LifeStateUI(cellPx, ctx, canv) {
        this.cellPx = cellPx;
        this.ctx = ctx;
        this.canv = canv;
        this.intervalID = -1;
        this.defaultColorWrapper = new LifeColorWrapper();
        this.model = new LifeStateModel();
    }
    LifeStateUI.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        this.ctx.fillStyle = bgColor;
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
                }
            }
        }
    };

    LifeStateUI.prototype.setColorForAge = function (i, j) {
        var age = this.model.ageGrid[i][j];
        this.ctx.fillStyle = this.defaultColorWrapper.lerpColors[age - 1];
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

var LifeColorWrapper = (function () {
    function LifeColorWrapper() {
        this.resetColors();
    }
    LifeColorWrapper.prototype.resetColors = function () {
        this.lerpColors = [];
        for (var i = 0; i < LifeRules.getMaxAge(); i++) {
            this.lerpColors[i] = this.lerpColor(i);
        }
    };

    LifeColorWrapper.prototype.lerpColor = function (currStep) {
        var t = currStep / LifeRules.getMaxAge();

        var red = Math.round(this.lerp(this.youngR, this.oldR, t));
        var green = Math.round(this.lerp(this.youngG, this.oldG, t));
        var blue = Math.round(this.lerp(this.youngB, this.oldB, t));

        return "rgb(" + red + ", " + green + ", " + blue + ")";
    };

    LifeColorWrapper.prototype.lerp = function (v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    };
    return LifeColorWrapper;
})();

var lifeUI;

var bgColor = "rgb(255,255,255)";

window.onload = function () {
    var canv;
    canv = document.getElementById('gameCanvas');
    canv.style.border = "1px solid gray";

    var ctx;
    ctx = canv.getContext("2d");
    ctx.fillStyle = "rgb(200,0,0)";

    canv.width = window.innerWidth - 20;
    canv.height = window.innerHeight - 100;

    refreshRules();

    var cellPx = Number(getValue('txtCellPixels'));
    lifeUI = new LifeStateUI(cellPx, ctx, canv);
    lifeUI.reset();
    lifeUI.draw();

    var btnStartStop = document.getElementById('btnStartStop');
    btnStartStop.onclick = function () {
        if (lifeUI.intervalID == -1) {
            refreshRules();
            refreshColors();
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
        refreshRules();
        refreshColors();
        lifeUI.cellPx = Number(getValue('txtCellPixels'));
        lifeUI.reset();
        lifeUI.draw();
        btnStartStop.innerHTML = "Start";
    };
};

function getValue(inputName) {
    return document.getElementById(inputName).value;
}

function refreshRules() {
    LifeRules.setSurvivalBirthStates(getValue('txtSurvivalBirth'));
    LifeRules.setMaxAge(Number(getValue('txtMaxAge')));
    LifeRules.setLivingStartOdds(Number(getValue('txtStartingLiveOdds')));
}

function refreshColors() {
    var startColorString = getValue('txtYoungColor');
    var endColorString = getValue('txtOldColor');

    var startColorsSplit = startColorString.split(",");
    var endColorsSplit = endColorString.split(",");

    lifeUI.defaultColorWrapper.youngR = Number(startColorsSplit[0]);
    lifeUI.defaultColorWrapper.youngG = Number(startColorsSplit[1]);
    lifeUI.defaultColorWrapper.youngB = Number(startColorsSplit[2]);
    lifeUI.defaultColorWrapper.oldR = Number(endColorsSplit[0]);
    lifeUI.defaultColorWrapper.oldG = Number(endColorsSplit[1]);
    lifeUI.defaultColorWrapper.oldB = Number(endColorsSplit[2]);

    lifeUI.defaultColorWrapper.resetColors();

    var bgColorString = getValue('txtBGColor');
    var bgColorsSplit = bgColorString.split(",");
    bgColor = "rgb(" + bgColorsSplit[0] + "," + bgColorsSplit[1] + "," + bgColorsSplit[2] + ")";
}
//# sourceMappingURL=app.js.map
