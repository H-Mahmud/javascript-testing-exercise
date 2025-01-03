import { describe, it, expect } from "vitest";
import { calculateAverage, fizzBuzz, factorial, max } from "../src/intro";

describe("max", () => {
    it("should return the first argument if it is getter", () => {
        expect(max(1, 2)).toBe(2);
    });

    it("should return the second argument if it is getter", () => {
        expect(max(2, 1)).toBe(2);
    });

    it("should return the first argument if arguments are equal", () => {
        expect(max(1, 1)).toBe(1);
    });
});

describe("fizzBuzz", () => {
    it("should return FizzBuzz if argument is devisable by 3 and 5", () => {
        expect(fizzBuzz(15)).toBe("FizzBuzz");
    });

    it("should return Fizz if argument is only devisable by 3", () => {
        expect(fizzBuzz(6)).toBe("Fizz");
    });

    it("should return Buzz if argument is only devisable by 5", () => {
        expect(fizzBuzz(25)).toBe("Buzz");
    });

    it("should return argument string if it is not devisable by 3 or 5", () => {
        expect(fizzBuzz("1")).toBe("1");
    });
});

describe("calculateAverage", () => {
    it("should return NaN if argument given argument an array", () => {
        expect(calculateAverage([])).toBe(NaN);
    });

    it("should calculate the average of an array with single element", () => {
        expect(calculateAverage([1])).toBe(1);
    });

    it("should calculate the average of an array with two and more than two elements", () => {
        expect(calculateAverage([1, 2])).toBe(1.5);
        expect(calculateAverage([1, 2, 3])).toBe(2);
    });
});

describe("getFactorial", () => {
    it("should return undefine if given a negative number", () => {
        expect(factorial(-1)).toBeUndefined();
    });

    it("should return 1 if given value 0", () => {
        expect(factorial(0)).toBe(1);
    });

    it("should return 1 if given value 1", () => {
        expect(factorial(1)).toBe(1);
    });

    it("should return 3 if given value 2", () => {
        expect(factorial(3)).toBe(6);
    });

    it("should return 120 if given value 5", () => {
        expect(factorial(5)).toBe(120);
    });
});
