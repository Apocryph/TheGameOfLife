///<reference path="references.ts"/>
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
//# sourceMappingURL=LifeStateModel.js.map
