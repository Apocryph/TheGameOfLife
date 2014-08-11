class LifeStateModel {
    gridOne: boolean[][];
    gridTwo: boolean[][];
    currGridOne: boolean = true;

    survivalStates: number[];
    birthStates: number[];

    constructor(public width: number, public height: number, survivalBirth: string) {
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

        //this.survivalStates = [2, 3];
        //this.birthStates = [3];
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
        if (this.currGridOne) {
            this.gridTwo[i][j] = this.getNewCellState(i, j);
        } else {
            this.gridOne[i][j] = this.getNewCellState(i, j);
        }
    }

    private getNewCellState(i: number, j: number): boolean{
        var sumOfNeighbors: number = this.sumNeighborsOf(i, j);
        if ((this.currGridOne && this.gridOne[i][j]) || (!this.currGridOne && this.gridTwo[i][j])) //current cell is alive
            //return sumOfNeighbors >= 2 && sumOfNeighbors <= 3;
            return this.survivalStates.indexOf(sumOfNeighbors) != -1;
        else //current cell is dead
            //return sumOfNeighbors == 3;
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

        if (this.currGridOne) {
            if (this.gridOne[i][j])
                return 1;
            return 0;
        }
        if (this.gridTwo[i][j])
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
                    this.ctx.fillRect(i * this.cellSizePX, j * this.cellSizePX, this.cellSizePX, this.cellSizePX);
                }
            }
        }
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

    //canv.width = window.innerWidth;
    //canv.height = window.innerHeight;

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

    //setInterval(function () { lifeUI.run(); }, 10);
};