import { describe, it, expect } from "vitest";
import { WeddingBudgetService } from "@/features/couples/services/WeddingBudgetService";

describe("WeddingBudgetService", () => {
    it("should increase used budget but not exceed total", () => {
        expect(WeddingBudgetService.increaseUsedBudget(50, 30, 100)).toBe(80);
        expect(WeddingBudgetService.increaseUsedBudget(90, 20, 100)).toBe(100);
    });

    it("should decrease used budget but not go below zero", () => {
        expect(WeddingBudgetService.decreaseUsedBudget(50, 20)).toBe(30);
        expect(WeddingBudgetService.decreaseUsedBudget(10, 20)).toBe(0);
    });

    it("should reset used budget to zero", () => {
        expect(WeddingBudgetService.resetUsedBudget()).toBe(0);
    });
});
