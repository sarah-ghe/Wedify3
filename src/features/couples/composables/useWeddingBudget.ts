import { ref, computed } from "vue";
import { WeddingBudgetService } from "@/features/couples/services/WeddingBudgetService";

export function useWeddingBudget(totalBudget: number) {
    const usedBudget = ref(totalBudget);
    const remainingBudget = computed(() => totalBudget - usedBudget.value);

    function increaseUsedBudget(amount: number) {
        usedBudget.value = WeddingBudgetService.increaseUsedBudget(usedBudget.value, amount, totalBudget);
    }

    function decreaseUsedBudget(amount: number) {
        usedBudget.value = WeddingBudgetService.decreaseUsedBudget(usedBudget.value, amount);
    }

    function resetUsedBudget() {
        usedBudget.value = WeddingBudgetService.resetUsedBudget();
    }

    return {
        usedBudget,
        remainingBudget,
        increaseUsedBudget,
        decreaseUsedBudget,
        resetUsedBudget,
    };
}
