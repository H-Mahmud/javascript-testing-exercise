import { describe, it, expect } from "vitest";
import { fizzBuzz, max } from "../src/intro";

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
