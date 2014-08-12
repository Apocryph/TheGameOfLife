class LifeStateModel {
    gridOne: boolean[][];
    gridTwo: boolean[][];
    ageGrid: number[][];
    currGridOne: boolean = true;

    survivalStates: number[];
    birthStates: number[];

    constructor(public width: number, public height: number, survivalBirth: string) {
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
        var survivalChars: string[] = survivalBirthArray[0].split('');
        var birthChars: string[] = survivalBirthArray[1].split('');

        this.survivalStates = [];
        for (var i = 0; i < survivalChars.length; i++) {
            this.survivalStates[i] = Number(survivalChars[i]);
        }

        this.birthStates = [];
        for (var i = 0; i < birthChars.length; i++) {
            this.birthStates[i] = Number(birthChars[i]);
        }
    }

    private getCurrState(i: number, j: number) : boolean{
        if (this.currGridOne)
            return this.gridOne[i][j];
        return this.gridTwo[i][j];
    }

    private setState(i: number, j: number, newState: boolean, forStateOne: boolean){
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
        var oldState: boolean = this.getCurrState(i,j);
        var age: number = this.ageGrid[i][j];

        if (newState && age < 3)
            this.ageGrid[i][j]++;// = this.ageGrid[i][j] + 1;
        else if (!newState && oldState)
            this.ageGrid[i][j] = 0;

        this.setState(i, j, newState, !this.currGridOne);
    }

    private getNewCellState(i: number, j: number): boolean{
        var sumOfNeighbors: number = this.sumNeighborsOf(i, j);
        if (this.getCurrState(i,j)) //current cell is alive
            return this.survivalStates.indexOf(sumOfNeighbors) != -1;
        else //current cell is dead
            return this.birthStates.indexOf(sumOfNeighbors) != -1;
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

        if (this.getCurrState(i,j))
            return 1;
        return 0;
    }
}

class LifeStateUI {
    model: LifeStateModel;
    intervalID: number = -1;

    constructor(width: number, height: number, public ctx: CanvasRenderingContext2D, public canv: HTMLCanvasElement, public cellSizePX: number, survivalBirth: string) {
        this.model = new LifeStateModel(width, height, survivalBirth);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        var boolGrid: boolean[][];
        if (this.model.currGridOne)
            boolGrid = this.model.gridOne;
        else
            boolGrid = this.model.gridTwo;

        for (var i = 0; i < this.model.height; i++) {
            for (var j = 0; j < this.model.width; j++) {
                if (boolGrid[i][j]) {
                    this.setColorForAge(i,j);
                    this.ctx.fillRect(i * this.cellSizePX, j * this.cellSizePX, this.cellSizePX, this.cellSizePX);
                }
            }
        }
    }

    private setColorForAge(i: number, j: number){
        var age: number = this.model.ageGrid[i][j];
        var colorString: string;
        if (age == 3)
            colorString = "rgb(128,0,0)";
        else if (age == 2)
            colorString = "rgb(178,42,42)";
        else if (age == 1)
            colorString = "rgb(255,0,0)";
        else
            colorString = "rgb(0,255,0)"

        this.ctx.fillStyle = colorString;
    }

    run() {
        this.model.update();
        this.draw();
    }
}

window.onload = () => {

    var canv: any;
    canv = document.getElementById('gameCanvas');
    canv.style.border = "1px solid gray";

    var ctx: any;
    ctx = canv.getContext("2d");
    ctx.fillStyle = "rgb(200,0,0)";

    var cellPx: number = 5;
    var horizontalCells = canv.width / cellPx;
    var verticalCells = canv.height / cellPx;

    var lifeUI: LifeStateUI = new LifeStateUI(verticalCells, horizontalCells, ctx, canv, cellPx, (<HTMLInputElement>document.getElementById('txtSurvivalBirth')).value);
    lifeUI.draw();

    var btnStartStop: HTMLButtonElement = <HTMLButtonElement>document.getElementById('btnStartStop');
    btnStartStop.onclick = function () {
        if (lifeUI.intervalID == -1) {
            btnStartStop.innerHTML = "Stop";
            lifeUI.intervalID = setInterval(function () { lifeUI.run(); }, 1000 / Number((<HTMLInputElement>document.getElementById('txtSpeed')).value));
        }
        else
        {
            btnStartStop.innerHTML = "Start";
            clearInterval(lifeUI.intervalID);
            lifeUI.intervalID = -1;
        }
    };

    var btnStep: HTMLButtonElement = <HTMLButtonElement>document.getElementById('btnStep');
    btnStep.onclick = function () {
        lifeUI.run();
    };

    var btnReset: HTMLButtonElement = <HTMLButtonElement>document.getElementById('btnReset');
    btnReset.onclick = function () {
        if (lifeUI.intervalID != -1)
            clearInterval(lifeUI.intervalID);
        lifeUI = new LifeStateUI(verticalCells, horizontalCells, ctx, canv, cellPx, (<HTMLInputElement>document.getElementById('txtSurvivalBirth')).value);
        lifeUI.draw();
        btnStartStop.innerHTML = "Start";
    };
};