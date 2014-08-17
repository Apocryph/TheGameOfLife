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
    LifeRules.setMinAge(Number(getValue('txtMinAge')));
    LifeRules.setLivingStartOdds(Number(getValue('txtStartingLiveOdds')));

    var chkIsTorus = document.getElementById('chkIsTorus');
    LifeRules.setIsTorus(chkIsTorus.checked);
}

function refreshColors() {
    var youngLifeColorString = getValue('txtYoungLifeColor');
    var oldLifeColorString = getValue('txtOldLifeColor');

    var youngLifeColorsSplit = youngLifeColorString.split(",");
    var oldLifeColorsSplit = oldLifeColorString.split(",");

    lifeUI.lifeColorWrapper.youngColor.red = Number(youngLifeColorsSplit[0]);
    lifeUI.lifeColorWrapper.youngColor.green = Number(youngLifeColorsSplit[1]);
    lifeUI.lifeColorWrapper.youngColor.blue = Number(youngLifeColorsSplit[2]);
    lifeUI.lifeColorWrapper.oldColor.red = Number(oldLifeColorsSplit[0]);
    lifeUI.lifeColorWrapper.oldColor.green = Number(oldLifeColorsSplit[1]);
    lifeUI.lifeColorWrapper.oldColor.blue = Number(oldLifeColorsSplit[2]);
    lifeUI.lifeColorWrapper.steps = LifeRules.getMaxAge();
    lifeUI.lifeColorWrapper.resetColors();

    var youngDeathColorString = getValue('txtYoungDeathColor');
    var oldDeathColorString = getValue('txtOldDeathColor');

    var youngDeathColorsSplit = youngDeathColorString.split(",");
    var oldDeathColorsSplit = oldDeathColorString.split(",");

    lifeUI.deathColorWrapper.youngColor.red = Number(youngDeathColorsSplit[0]);
    lifeUI.deathColorWrapper.youngColor.green = Number(youngDeathColorsSplit[1]);
    lifeUI.deathColorWrapper.youngColor.blue = Number(youngDeathColorsSplit[2]);
    lifeUI.deathColorWrapper.oldColor.red = Number(oldDeathColorsSplit[0]);
    lifeUI.deathColorWrapper.oldColor.green = Number(oldDeathColorsSplit[1]);
    lifeUI.deathColorWrapper.oldColor.blue = Number(oldDeathColorsSplit[2]);
    lifeUI.deathColorWrapper.steps = (LifeRules.getMinAge() * -1) + 1;
    lifeUI.deathColorWrapper.resetColors();

    var bgColorString = getValue('txtBGColor');
    var bgColorsSplit = bgColorString.split(",");
    lifeUI.bgColor = "rgb(" + bgColorsSplit[0] + "," + bgColorsSplit[1] + "," + bgColorsSplit[2] + ")";
}
//# sourceMappingURL=app.js.map
