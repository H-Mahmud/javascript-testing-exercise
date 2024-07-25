import { describe, it, expect } from "vitest";
import { getCoupons } from "../src/core";

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
