import { describe, it, expect } from "vitest";
import {
    calculateDiscount,
    getCoupons,
    isPriceInRange,
    isValidUsername,
    validateUserInput,
} from "../src/core";

describe("getCoupon", () => {
    it("should return an array with valid coupons", () => {
        const coupons = getCoupons();
        const isArray = Array.isArray(coupons);
        expect(isArray).toBe(true);
        expect(coupons.length).toBeGreaterThan(1);
    });

    it("should return an array with valid coupon codes", () => {
        const coupons = getCoupons();
        coupons.forEach((coupon) => {
            expect(coupon).toHaveProperty("code");
            expect(typeof coupon.code).toBe("string");
            expect(coupon.code).toBeTruthy();
        });
    });

    it("should return an array with valid coupon discounts", () => {
        const coupons = getCoupons();
        coupons.forEach((coupon) => {
            expect(coupon).toHaveProperty("discount");
            expect(typeof coupon.discount).toBe("number");
            expect(coupon.discount).toBeGreaterThan(0);
            expect(coupon.discount).toBeLessThan(1);
        });
    });
});

describe("calculateDiscount", () => {
    it("should handle non-numeric price", () => {
        expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
    });

    it("should handle negative price", () => {
        expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
    });

    it("should handle non-string discount code", () => {
        expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
    });

    it("should handle invalid coupon", () => {
        expect(calculateDiscount(10, "INVALID")).toBe(10);
    });

    it("should calculate discount for valid coupon", () => {
        expect(calculateDiscount(10, "SAVE10")).toBe(9);
        expect(calculateDiscount(10, "SAVE20")).toBe(8);
    });
});

describe("validUserInput", () => {
    it("should return success if given valid input", () => {
        expect(validateUserInput("Hasan", 18)).toMatch(/success/i);
    });

    it("should return an error if username not a string", () => {
        expect(validateUserInput(111, 18)).toMatch(/invalid/i);
    });

    it("should return an error if username is less than three characters", () => {
        expect(validateUserInput("aa", 18)).toMatch(/invalid/i);
    });

    it("should return an error if username is more than 15 characters", () => {
        expect(validateUserInput("a".repeat(16), 18)).toMatch(/invalid/i);
    });

    it("should return an error if age not a number", () => {
        expect(validateUserInput("Hasan", "18")).toMatch(/invalid/i);
    });

    it("should return an error if age is less than 18", () => {
        expect(validateUserInput("Hasan", 0)).toMatch(/invalid/i);
    });

    it("should return an error if age is more than 100", () => {
        expect(validateUserInput("Hasan", 101)).toMatch(/invalid/i);
    });

    it("should return an error if both username and age is invalid", () => {
        expect(validateUserInput("", 0)).toMatch(/invalid username/i);
        expect(validateUserInput("", 0)).toMatch(/invalid age/i);
    });
});

describe("isPriceInRange", () => {
    it("should return false when the price is outside of the range", () => {
        expect(isPriceInRange(-10, 0, 100)).toBe(false);
        expect(isPriceInRange(200, 0, 100)).toBe(false);
    });

    it("should return true when min and max range equal to the price", () => {
        expect(isPriceInRange(0, 0, 100)).toBe(true);
        expect(isPriceInRange(100, 0, 100)).toBe(true);
    });

    it("should return true when the price is inside the range", () => {
        expect(isPriceInRange(50, 0, 100)).toBe(true);
        expect(isPriceInRange(100, 0, 100)).toBe(true);
    });
});

describe("isValidUsername", () => {
    const minLength = 5;
    const maxLength = 15;

    it("should return false if username is too short", () => {
        expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
    });

    it("should return false if username is too long", () => {
        expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
    });

    it("should return true if username length is equal to min or max constants", () => {
        expect(isValidUsername("a".repeat(minLength))).toBe(true);
        expect(isValidUsername("a".repeat(maxLength))).toBe(true);
    });

    it("should return false if username is given invalid", () => {
        expect(isValidUsername(null)).toBe(false);
        expect(isValidUsername(undefined)).toBe(false);
        expect(isValidUsername(1)).toBe(false);
    });
});
