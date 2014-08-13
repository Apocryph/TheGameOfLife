///<reference path="references.ts"/>
var lifeUI;

window.onload = function () {
    var canv;
    canv = document.getElementById('gameCanvas');
    canv.style.border = "1px solid gray";

    var ctx;
    ctx = canv.getContext("2d");
    ctx.fillStyle = "rgb(200,0,0)";

    canv.width = window.innerWidth - 20;
    canv.height = window.innerHeight - 200;

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
    lifeUI.bgColor = "rgb(" + bgColorsSplit[0] + "," + bgColorsSplit[1] + "," + bgColorsSplit[2] + ")";
}
//# sourceMappingURL=app.js.map
