export class WeddingBudgetService {
    static increaseUsedBudget(current: number, amount: number, total: number): number {
        return Math.min(current + amount, total);
    }

    static decreaseUsedBudget(current: number, amount: number): number {
        return Math.max(current - amount, 0);
    }

    static resetUsedBudget(): number {
        return 0;
    }
}
