import { it, vi, expect, describe } from "vitest";
import {
    getPriceInCurrency,
    getShippingInfo,
    renderPage,
    submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");

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

describe("renderPage", () => {
    it("should return the correct content", async () => {
        const result = await renderPage();

        expect(result).toMatch(/content/i);
    });

    it("should called analytics", async () => {
        await renderPage();

        expect(trackPageView).toHaveBeenCalledWith("/home");
    });
});

describe("submitOrder", () => {
    const order = {
        totalAmount: 10,
    };
    const creditCard = {
        creditCardNumber: 1234,
    };

    it("should should charge the customer", () => {
        vi.mocked(charge).mockResolvedValue({ status: "success" });

        submitOrder(order, creditCard);

        expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
    });

    it("should return success when payment is successful", async () => {
        vi.mocked(charge).mockReturnValue({ status: "success" });

        const result = await submitOrder(order, creditCard);

        expect(result).toEqual({
            success: true,
        });
    });

    it("should return failed when payment is not successful", async () => {
        vi.mocked(charge).mockReturnValue({ status: "failed" });

        const result = await submitOrder(order, creditCard);

        expect(result).toEqual({
            success: false,
            error: "payment_error",
        });
    });
});
