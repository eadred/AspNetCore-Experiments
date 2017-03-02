export class Multiplier {
    private readonly _name: string;
    private readonly _multiplier: number

    constructor(name: string, multiplier:number) {
        this._name = name;
        this._multiplier = multiplier;
    }

    get name(): string {
        return this._name;
    }

    get multiplier(): number {
        return this._multiplier;
    }

    public multiply(input: number):number {
        return input * this._multiplier;
    }
}