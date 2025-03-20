import { beforeEach, describe, expect, it } from "vitest";
import {
    calculateDiscount,
    canDrive,
    fetchData,
    fetchDataReject,
    getCoupons,
    isPriceInRange,
    isValidUsername,
    Stack,
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
    it.each([
        { scenario: "price < min", price: -10, result: false },
        { scenario: "price = min", price: 0, result: true },
        { scenario: "price is between min and max", price: 50, result: true },
        { scenario: "price > max", price: 200, result: false },
        { scenario: "price = max", price: 100, result: true },
    ])("Should return $result when $scenario", ({ price, result }) => {
        expect(isPriceInRange(price, 0, 100)).toBe(result);
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

describe("canDrive", () => {
    it("should return an error if country code is invalid", () => {
        expect(canDrive(20, "BD")).toMatch(/invalid/i);
    });
    it.each([
        { age: 15, country: "US", result: false },
        { age: 16, country: "US", result: true },
        { age: 17, country: "US", result: true },
        { age: 16, country: "UK", result: false },
        { age: 17, country: "UK", result: true },
        { age: 18, country: "UK", result: true },
    ])(
        "should return $result for $age, $country",
        ({ age, country, result }) => {
            expect(canDrive(age, country)).toBe(result);
        }
    );
});
describe("fetchData", async () => {
    it("should return a promise that resolve an array of number", async () => {
        const array = await fetchData();
        expect(Array.isArray(array)).toBe(true);
        expect(array.length).toBeGreaterThan(0);
    });
});

describe("fetchDataReject", async () => {
    it("should return a rejected promise reason is fail", async () => {
        try {
            const result = await fetchDataReject();
        } catch (error) {
            expect(error).haveOwnProperty("reason");
            expect(error.reason).toMatch(/fail/);
        }
    });
});

describe("Stack", () => {
    let stack;
    beforeEach(() => {
        stack = new Stack();
    });
    it("push should add an item to the stack", () => {
        stack.push(1);

        expect(stack.size()).toBe(1);
    });

    it("pop should throw an error if stack is empty", () => {
        expect(() => stack.pop()).throw(/empty/);
    });

    it("pop should remove and return the top item from the stack", () => {
        stack.push(1);
        stack.push(2);

        const poppedItem = stack.pop();

        expect(poppedItem).toBe(2);
        expect(stack.size()).toBe(1);
    });

    it("peek should throw and error if stack is empty", () => {
        expect(() => stack.peek()).throw(/empty/);
    });

    it("Peek should return the top item from stack", () => {
        stack.push(1);
        stack.push(2);

        const peeked = stack.peek();

        expect(peeked).toBe(2);
    });

    it("isEmpty should return true if stack is empty", () => {
        expect(stack.isEmpty()).toBe(true);
    });

    it("isEmpty should return false if stack not empty", () => {
        stack.push(1);

        expect(stack.isEmpty()).toBe(false);
    });

    it("size should return number of items in the stack", () => {
        stack.push(1);
        stack.push(1);

        expect(stack.size()).toBe(2);
    });

    it("clear should remove all item from the stack", () => {
        stack.push(1);
        stack.push(1);

        stack.clear();

        expect(stack.size()).toBe(0);
    });
});
