﻿///<reference path="references.ts"/>

class LifeRules {
    private static survivalStates: number[];
    private static birthStates: number[];
    private static maxAge: number;
    private static minAge: number;
    private static livingStartOdds: number;
    private static isTorus: boolean;

    static setSurvivalBirthStates(inputString: string): void {

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

    static setMinAge(newMin: number): void {
        this.minAge = newMin;
    }

    static getMinAge(): number {
        return this.minAge;
    }

    static setLivingStartOdds(newOdds: number): void {
        this.livingStartOdds = newOdds;
    }

    static getLivingStartOdds(): number {
        return this.livingStartOdds;
    }

    static setIsTorus(newIsTorus: boolean): void {
        this.isTorus = newIsTorus;
    }

    static getIsTorus(): boolean {
        return this.isTorus;
    }
}