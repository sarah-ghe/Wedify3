import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWeddingBudget } from "@/features/couples/composables/useWeddingBudget";
import { WeddingBudgetService } from "@/features/couples/services/WeddingBudgetService";

vi.mock("@/features/couples/services/WeddingBudgetService");

describe("useWeddingBudget", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (WeddingBudgetService.increaseUsedBudget as unknown as (current: number, amount: number, total: number) => number)
            = (c: number, a: number, t: number) => Math.min(c + a, t);
        (WeddingBudgetService.decreaseUsedBudget as unknown as (current: number, amount: number) => number)
            = (c: number, a: number) => Math.max(c - a, 0);
        (WeddingBudgetService.resetUsedBudget as unknown as () => number)
            = () => 0;
    });

    it("should initialize with totalBudget as usedBudget", () => {
        const { usedBudget } = useWeddingBudget(100);
        expect(usedBudget.value).toBe(100);
    });

    it("should increase usedBudget", () => {
        const { usedBudget, increaseUsedBudget } = useWeddingBudget(100);
        usedBudget.value = 50;
        increaseUsedBudget(20);
        expect(usedBudget.value).toBe(70);
    });

    it("should decrease usedBudget", () => {
        const { usedBudget, decreaseUsedBudget } = useWeddingBudget(100);
        usedBudget.value = 50;
        decreaseUsedBudget(20);
        expect(usedBudget.value).toBe(30);
    });

    it("should reset usedBudget", () => {
        const { usedBudget, resetUsedBudget } = useWeddingBudget(100);
        usedBudget.value = 50;
        resetUsedBudget();
        expect(usedBudget.value).toBe(0);
    });

    it("should compute remainingBudget", () => {
        const { usedBudget, remainingBudget } = useWeddingBudget(100);
        usedBudget.value = 60;
        expect(remainingBudget.value).toBe(40);
    });
});
