class LifeState {
    grid: boolean[][];

    constructor(public width: number, public height: number) {
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                this.grid[i][j] = true;
                //this.grid[i][j] = (i + j) % 5 == 0;
            }
        }
    }
}

window.onload = () => {
    //var el = document.getElementById('content');
    //var greeter = new Greeter(el);
    //greeter.start();

    var canv: any;
    canv = document.getElementById('gameCanvas');
    canv.width = 600;
    canv.height = 600;
    canv.style.border = "1px solid gray";

    var ctx: any;
    ctx = canv.getContext('2d');
    ctx.fillStyle = "rgb(200,0,0)";

    var testState: LifeState = new LifeState(100, 100);

    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            if (testState.grid[i][j] == true) {
                ctx.FillRect(i * 10, j * 10, 10, 10);
            }
        }
    }
};