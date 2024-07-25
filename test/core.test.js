import { describe, it, expect } from "vitest";
import { calculateDiscount, getCoupons } from "../src/core";

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
