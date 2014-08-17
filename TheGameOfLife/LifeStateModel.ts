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

        if (newState) {
            if (age < 1)
                this.ageGrid[i][j] = 1;
            else if (age < LifeRules.getMaxAge())
                this.ageGrid[i][j]++;
        }
        else
        {
            if (age > 0)
                this.ageGrid[i][j] = 0;
            else if (age > LifeRules.getMinAge())
                this.ageGrid[i][j]--;
        }

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

        //var neighbors: LifeCoordinates[] = this.getNeighborsOf(i, j);
        //for (var x: number = 0; x < neighbors.length; x++) {
        //    sum += this.getValueForNeighborAtCoords(neighbors[x]);
        //}
        return sum;
    }

    private getValueForNeighborAt(i: number, j: number): number {
        if (LifeRules.getIsTorus()) {
            if (i < 0)
                i = this.height - 1;
            else if (i >= this.height)
                i = 0;
            if (j < 0)
                j = this.width - 1;
            else if (j >= this.width)
                j = 0;
        } else {
            if (i < 0 || i >= this.height)
                return 0;

            if (j < 0 || j >= this.width)
                return 0;
        }

        if (this.getCurrState(i, j))
            return 1;
        return 0;
    }

    //private getNeighborsOf(i: number, j: number): LifeCoordinates[] {
    //    var neighbors = [];
    //    var iLess: number = i - 1;
    //    var iGreater: number = i + 1;
    //    var jLess: number = j - 1;
    //    var jGreater: number = j + 1;

    //    if (iLess < 0)
    //        iLess = this.height - 1;
    //    if (iGreater >= this.height)
    //        iGreater = 0;
    //    if (jLess < 0)
    //        jLess = this.width - 1;
    //    if (jGreater >= this.width)
    //        jGreater = 0;

    //    neighbors[0] = new LifeCoordinates(iLess, jLess);
    //    neighbors[1] = new LifeCoordinates(iLess, j);
    //    neighbors[2] = new LifeCoordinates(iLess, jGreater);
    //    neighbors[3] = new LifeCoordinates(i, jLess);
    //    neighbors[4] = new LifeCoordinates(i, jGreater);
    //    neighbors[5] = new LifeCoordinates(iGreater, jLess);
    //    neighbors[6] = new LifeCoordinates(iGreater, j);
    //    neighbors[7] = new LifeCoordinates(iGreater, jGreater);
    //    return neighbors;
    //}

    //private getValueForNeighborAtCoords(coords: LifeCoordinates) : number{
    //    return this.getValueForNeighborAt(coords.i, coords.j);
    //}
}

//class LifeCoordinates {
//    constructor(public i: number, public j: number) {

//    }
//}