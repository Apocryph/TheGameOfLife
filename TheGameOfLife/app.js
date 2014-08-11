var LifeState = (function () {
    function LifeState(width, height) {
        this.width = width;
        this.height = height;
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                this.grid[i][j] = true;
                //this.grid[i][j] = (i + j) % 5 == 0;
            }
        }
    }
    return LifeState;
})();

window.onload = function () {
    //var el = document.getElementById('content');
    //var greeter = new Greeter(el);
    //greeter.start();
    var canv;
    canv = document.getElementById('gameCanvas');
    canv.width = 600;
    canv.height = 600;
    canv.style.border = "1px solid gray";

    var ctx;
    ctx = canv.getContext('2d');
    ctx.fillStyle = "rgb(200,0,0)";

    var testState = new LifeState(100, 100);

    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            if (testState.grid[i][j] == true) {
                ctx.FillRect(i * 10, j * 10, 10, 10);
            }
        }
    }
};
//# sourceMappingURL=app.js.map
