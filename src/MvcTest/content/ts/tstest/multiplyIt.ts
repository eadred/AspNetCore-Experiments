﻿import { Multiplier } from "./types/multiplier";

export function multiplyIt(x: number): number {
    var m = new Multiplier("Test", 3);
    return m.multiply(x);
}