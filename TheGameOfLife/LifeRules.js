﻿///<reference path="references.ts"/>
var LifeRules = (function () {
    function LifeRules() {
    }
    LifeRules.setSurvivalBirthStates = function (inputString) {
        var survivalBirthArray = inputString.split('/');
        var survivalChars = survivalBirthArray[0].split('');
        var birthChars = survivalBirthArray[1].split('');

        this.survivalStates = [];
        for (var i = 0; i < survivalChars.length; i++) {
            this.survivalStates[i] = Number(survivalChars[i]);
        }

        this.birthStates = [];
        for (var i = 0; i < birthChars.length; i++) {
            this.birthStates[i] = Number(birthChars[i]);
        }
    };

    LifeRules.getSurvivalStates = function () {
        return this.survivalStates;
    };

    LifeRules.getBirthStates = function () {
        return this.birthStates;
    };

    LifeRules.setMaxAge = function (newMax) {
        this.maxAge = newMax;
    };

    LifeRules.getMaxAge = function () {
        return this.maxAge;
    };

    LifeRules.setMinAge = function (newMin) {
        this.minAge = newMin;
    };

    LifeRules.getMinAge = function () {
        return this.minAge;
    };

    LifeRules.setLivingStartOdds = function (newOdds) {
        this.livingStartOdds = newOdds;
    };

    LifeRules.getLivingStartOdds = function () {
        return this.livingStartOdds;
    };

    LifeRules.setIsTorus = function (newIsTorus) {
        this.isTorus = newIsTorus;
    };

    LifeRules.getIsTorus = function () {
        return this.isTorus;
    };
    return LifeRules;
})();
//# sourceMappingURL=LifeRules.js.map
