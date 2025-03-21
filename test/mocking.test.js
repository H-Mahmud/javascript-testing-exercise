import { it, vi, expect, describe } from "vitest";
import { getPriceInCurrency, getShippingInfo } from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");

describe("getPriceInCurrency", () => {
    it("should return price in target currency", () => {
        vi.mocked(getExchangeRate).mockReturnValue(10);

        const result = getPriceInCurrency(1.5, "USD");

        expect(result).toBe(15);
    });
});

describe("getShippingInfo", () => {
    it("should return shipping unavailable if quote cannot be fetched", () => {
        vi.mocked(getShippingQuote).mockReturnValue(null);

        const result = getShippingInfo("Dhaka");

        expect(result).toMatch(/unavailable/i);
    });

    it("should return shipping info if quote can be fetched", () => {
        vi.mocked(getShippingQuote).mockReturnValue({
            cost: 10,
            estimatedDays: 3,
        });

        const result = getShippingInfo("Dhaka");

        expect(result).toMatch("$10");
        expect(result).toMatch(/3 days/i);
    });
});
