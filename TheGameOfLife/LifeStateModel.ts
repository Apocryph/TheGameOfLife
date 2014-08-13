///<reference path="references.ts"/>

class LifeStateModel {
    gridOne: boolean[][];
    gridTwo: boolean[][];
    ageGrid: number[][];
    currGridOne: boolean = true;
    width: number;
    height: number;

    constructor() {

    }

    reset(newWidth: number, newHeight: number): void {
        this.width = newWidth;
        this.height = newHeight;
        this.resetGrid();
    }

    private resetGrid(): void {
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
    }

    private getCurrState(i: number, j: number): boolean {
        if (this.currGridOne)
            return this.gridOne[i][j];
        return this.gridTwo[i][j];
    }

    private setState(i: number, j: number, newState: boolean, forStateOne: boolean) {
        if (forStateOne)
            this.gridOne[i][j] = newState;
        else
            this.gridTwo[i][j] = newState;
    }

    update() {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.processIndex(i, j);
            }
        }
        this.currGridOne = !this.currGridOne;
    }

    private processIndex(i: number, j: number) {
        var newState: boolean = this.getNewCellState(i, j);
        var oldState: boolean = this.getCurrState(i, j);
        var age: number = this.ageGrid[i][j];

        if (newState && age < LifeRules.getMaxAge())
            this.ageGrid[i][j]++;// = this.ageGrid[i][j] + 1;
        else if (!newState && oldState)
            this.ageGrid[i][j] = 0;

        this.setState(i, j, newState, !this.currGridOne);
    }

    private getNewCellState(i: number, j: number): boolean {
        var sumOfNeighbors: number = this.sumNeighborsOf(i, j);
        if (this.getCurrState(i, j)) //current cell is alive
            return LifeRules.getSurvivalStates().indexOf(sumOfNeighbors) != -1;
        else //current cell is dead
            return LifeRules.getBirthStates().indexOf(sumOfNeighbors) != -1;
    }

    private sumNeighborsOf(i: number, j: number): number {
        var sum: number = 0;
        for (var y = i - 1; y <= i + 1; y++) {
            for (var x = j - 1; x <= j + 1; x++) {
                if (y != i || x != j)
                    sum += this.getValueForNeighborAt(y, x);
            }
        }
        return sum;
    }

    private getValueForNeighborAt(i: number, j: number): number {
        if (i < 0 || i >= this.height)
            return 0;

        if (j < 0 || j >= this.width)
            return 0;

        if (this.getCurrState(i, j))
            return 1;
        return 0;
    }
}