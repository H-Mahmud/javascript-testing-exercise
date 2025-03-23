import { it, vi, expect, describe } from "vitest";
import {
    getPriceInCurrency,
    getShippingInfo,
    isOnline,
    login,
    renderPage,
    signUp,
    submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");
vi.mock("../src/libs/email", async (importOriginal) => {
    const originalModule = await importOriginal();
    return {
        ...originalModule,
        sendEmail: vi.fn(),
    };
});

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

describe("signUp", () => {
    const email = "mail@examle.com";

    it("should return false if email is not invalid", async () => {
        const result = await signUp("a");

        expect(result).toBe(false);
    });

    it("should return true if email is invalid", async () => {
        const result = await signUp(email);

        expect(result).toBe(true);
    });

    it("should send the welcome email if email is valid", async () => {
        await signUp(email);

        expect(sendEmail).toHaveBeenCalledOnce();

        const args = vi.mocked(sendEmail).mock.calls[0];

        expect(args[0]).toBe(email);
        expect(args[1]).toMatch(/Welcome/i);
    });
});

describe("login", () => {
    it("should email the one-time login code", async () => {
        const email = "mail@example.com";
        const spy = vi.spyOn(security, "generateCode");

        await login(email);

        const securityCode = spy.mock.results[0].value.toString();

        expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
    });
});

describe("isOnline", () => {
    it("should return false if current hour is outside of opening hours", () => {
        vi.setSystemTime("2025-03-22 07:59");
        expect(isOnline()).toBe(false);

        vi.setSystemTime("2025-03-22 20:01");
        expect(isOnline()).toBe(false);
    });

    it("should return true if current hour is withing opening hours", () => {
        vi.setSystemTime("2025-03-22 08:00");
        expect(isOnline()).toBe(true);

        vi.setSystemTime("2025-03-22 19:59");
        expect(isOnline()).toBe(true);
    });
});
