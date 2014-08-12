class LifeRules {
    private static survivalStates: number[];
    private static birthStates: number[];
    private static maxAge: number;
    private static livingStartOdds: number;

    static setSurvivalBirthStates(inputString: string) : void {
         
        var survivalBirthArray = inputString.split('/');
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

    static getSurvivalStates(): number[] {
        return this.survivalStates;
    }

    static getBirthStates(): number[] {
        return this.birthStates;
    }

    static setMaxAge(newMax: number): void {
        this.maxAge = newMax;
    }

    static getMaxAge(): number {
        return this.maxAge;
    }

    static setLivingStartOdds(newOdds: number): void {
        this.livingStartOdds = newOdds;
    }

    static getLivingStartOdds(): number {
        return this.livingStartOdds;
    }
}

class LifeStateModel {
    gridOne: boolean[][];
    gridTwo: boolean[][];
    ageGrid: number[][];
    currGridOne: boolean = true;

    constructor(public width: number, public height: number) {
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

        if (newState && age < LifeRules.getMaxAge())
            this.ageGrid[i][j]++;// = this.ageGrid[i][j] + 1;
        else if (!newState && oldState)
            this.ageGrid[i][j] = 0;

        this.setState(i, j, newState, !this.currGridOne);
    }

    private getNewCellState(i: number, j: number): boolean{
        var sumOfNeighbors: number = this.sumNeighborsOf(i, j);
        if (this.getCurrState(i,j)) //current cell is alive
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

        if (this.getCurrState(i,j))
            return 1;
        return 0;
    }
}

class LifeStateUI {
    model: LifeStateModel;
    intervalID: number = -1;

    defaultColorWrapper: LifeColorWrapper = new LifeColorWrapper(69, 11, 187, 235, 0, 63, LifeRules.getMaxAge());

    constructor(width: number, height: number, public ctx: CanvasRenderingContext2D, public canv: HTMLCanvasElement, public cellSizePX: number) {
        this.model = new LifeStateModel(width, height);
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
        this.ctx.fillStyle = this.defaultColorWrapper.lerpColors[age - 1];
    }

    run() {
        this.model.update();
        this.draw();
    }
}

class LifeColorWrapper {
    lerpColors: string[] = [];

    constructor(oldR: number, oldG: number, oldB: number, youngR: number, youngG: number, youngB: number, public steps: number) {
        for (var i = 0; i < steps; i++) {
            this.lerpColors[i] = this.lerpColor(oldR, oldG, oldB, youngR, youngG, youngB, i);
        }
    }

    private lerpColor(oldR: number, oldG: number, oldB: number, youngR: number, youngG: number, youngB: number, currStep: number) : string {
        var t: number = currStep / this.steps;

        var red: number = Math.round(this.lerp(youngR, oldR, t));
        var green: number = Math.round(this.lerp(youngG, oldG, t));
        var blue: number = Math.round(this.lerp(youngB, oldB, t));

        return "rgb(" + red + ", " + green + ", " + blue + ")";
    }

    private lerp(v0: number, v1: number, t: number) : number {
        return (1 - t) * v0 + t * v1;
    }
}

window.onload = () => {

    var canv: any;
    canv = document.getElementById('gameCanvas');
    canv.style.border = "1px solid gray";

    var ctx: any;
    ctx = canv.getContext("2d");
    ctx.fillStyle = "rgb(200,0,0)";

    canv.width = window.innerWidth - 20;
    canv.height = window.innerHeight - 100;

    var cellPx: number = 5;
    var horizontalCells = canv.width / cellPx;
    var verticalCells = canv.height / cellPx;

    LifeRules.setSurvivalBirthStates(getValue('txtSurvivalBirth'));
    LifeRules.setMaxAge(Number(getValue('txtMaxAge')));
    LifeRules.setLivingStartOdds(Number(getValue('txtStartingLiveOdds')));

    var lifeUI: LifeStateUI = new LifeStateUI(verticalCells, horizontalCells, ctx, canv, cellPx);
    lifeUI.draw();

    var btnStartStop: HTMLButtonElement = <HTMLButtonElement>document.getElementById('btnStartStop');
    btnStartStop.onclick = function () {
        if (lifeUI.intervalID == -1) {
            LifeRules.setSurvivalBirthStates(getValue('txtSurvivalBirth'));
            LifeRules.setMaxAge(Number(getValue('txtMaxAge')));
            LifeRules.setLivingStartOdds(Number(getValue('txtStartingLiveOdds')));

            btnStartStop.innerHTML = "Stop";
            lifeUI.intervalID = setInterval(function () { lifeUI.run(); }, 1000 / Number(getValue('txtSpeed')));
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
        LifeRules.setSurvivalBirthStates(getValue('txtSurvivalBirth'));
        LifeRules.setMaxAge(Number(getValue('txtMaxAge')));
        LifeRules.setLivingStartOdds(Number(getValue('txtStartingLiveOdds')));
        lifeUI = new LifeStateUI(verticalCells, horizontalCells, ctx, canv, cellPx);
        lifeUI.draw();
        btnStartStop.innerHTML = "Start";
    };
};

function getValue(inputName: string): string {
    return (<HTMLInputElement>document.getElementById(inputName)).value;
}