import { it, vi, expect, describe } from "vitest";
import { getPriceInCurrency } from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";

vi.mock("../src/libs/currency");

describe("getPriceInCurrency", () => {
    it("should return price in target currency", () => {
        vi.mocked(getExchangeRate).mockReturnValue(10);

        const result = getPriceInCurrency(1.5, "USD");

        expect(result).toBe(15);
    });
});
