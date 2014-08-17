///<reference path="references.ts"/>

var lifeUI: LifeStateUI;

window.onload = () => {

    var canv: any;
    canv = document.getElementById('gameCanvas');
    canv.style.border = "1px solid gray";

    var ctx: any;
    ctx = canv.getContext("2d");
    ctx.fillStyle = "rgb(200,0,0)";

    canv.width = window.innerWidth - 20;
    canv.height = window.innerHeight - 200;

    refreshRules();

    var cellPx: number = Number(getValue('txtCellPixels'));
    lifeUI = new LifeStateUI(cellPx, ctx, canv);
    lifeUI.reset();
    lifeUI.draw();

    var btnStartStop: HTMLButtonElement = <HTMLButtonElement>document.getElementById('btnStartStop');
    btnStartStop.onclick = function () {
        if (lifeUI.intervalID == -1) {
            refreshRules();
            refreshColors();
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
        refreshRules();
        refreshColors();
        lifeUI.cellPx = Number(getValue('txtCellPixels'));
        lifeUI.reset();
        lifeUI.draw();
        btnStartStop.innerHTML = "Start";
    };
};

function getValue(inputName: string): string {
    return (<HTMLInputElement>document.getElementById(inputName)).value;
}

function refreshRules(): void {
    LifeRules.setSurvivalBirthStates(getValue('txtSurvivalBirth'));
    LifeRules.setMaxAge(Number(getValue('txtMaxAge')));
    LifeRules.setMinAge(Number(getValue('txtMinAge')));
    LifeRules.setLivingStartOdds(Number(getValue('txtStartingLiveOdds')));

    var chkIsTorus: HTMLInputElement = <HTMLInputElement>document.getElementById('chkIsTorus');
    LifeRules.setIsTorus(chkIsTorus.checked);
}

function refreshColors(): void {
    var youngLifeColorString: string = getValue('txtYoungLifeColor');
    var oldLifeColorString: string = getValue('txtOldLifeColor');

    var youngLifeColorsSplit: string[] = youngLifeColorString.split(",");
    var oldLifeColorsSplit: string[] = oldLifeColorString.split(",");

    lifeUI.lifeColorWrapper.youngColor.red = Number(youngLifeColorsSplit[0]);
    lifeUI.lifeColorWrapper.youngColor.green = Number(youngLifeColorsSplit[1]);
    lifeUI.lifeColorWrapper.youngColor.blue = Number(youngLifeColorsSplit[2]);
    lifeUI.lifeColorWrapper.oldColor.red = Number(oldLifeColorsSplit[0]);
    lifeUI.lifeColorWrapper.oldColor.green = Number(oldLifeColorsSplit[1]);
    lifeUI.lifeColorWrapper.oldColor.blue = Number(oldLifeColorsSplit[2]);
    lifeUI.lifeColorWrapper.steps = LifeRules.getMaxAge();
    lifeUI.lifeColorWrapper.resetColors();

    var youngDeathColorString: string = getValue('txtYoungDeathColor');
    var oldDeathColorString: string = getValue('txtOldDeathColor');

    var youngDeathColorsSplit: string[] = youngDeathColorString.split(",");
    var oldDeathColorsSplit: string[] = oldDeathColorString.split(",");

    lifeUI.deathColorWrapper.youngColor.red = Number(youngDeathColorsSplit[0]);
    lifeUI.deathColorWrapper.youngColor.green = Number(youngDeathColorsSplit[1]);
    lifeUI.deathColorWrapper.youngColor.blue = Number(youngDeathColorsSplit[2]);
    lifeUI.deathColorWrapper.oldColor.red = Number(oldDeathColorsSplit[0]);
    lifeUI.deathColorWrapper.oldColor.green = Number(oldDeathColorsSplit[1]);
    lifeUI.deathColorWrapper.oldColor.blue = Number(oldDeathColorsSplit[2]);
    lifeUI.deathColorWrapper.steps = (LifeRules.getMinAge() * -1) + 1;
    lifeUI.deathColorWrapper.resetColors();

    var bgColorString: string = getValue('txtBGColor');
    var bgColorsSplit: string[] = bgColorString.split(",");
    lifeUI.bgColor = "rgb(" + bgColorsSplit[0] + "," + bgColorsSplit[1] + "," + bgColorsSplit[2] + ")";
}