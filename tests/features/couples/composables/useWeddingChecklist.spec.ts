import { useWeddingChecklist } from "@/features/couples/composables/useWeddingChecklist";
import { WeddingChecklistService } from "@/features/couples/services/WeddingChecklistService";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/features/couples/services/WeddingChecklistService", () => ({
    WeddingChecklistService: {
        getByWeddingId: vi.fn(),
        addTask: vi.fn(),
        updateTask: vi.fn(),
        removeTask: vi.fn(),
    },
}));

describe("useWeddingChecklist", () => {
    beforeEach(() => vi.clearAllMocks());

    it("fetches tasks", async () => {
        const tasks = [{ id: "1", wedding_id: "w", task: "T", due_date: "", is_completed: false }];
        (WeddingChecklistService.getByWeddingId as any).mockResolvedValue({ data: tasks, error: null });
        const { fetchTasks, tasks: t } = useWeddingChecklist("w");
        await fetchTasks();
        expect(t.value).toEqual(tasks);
    });

    it("adds task", async () => {
        const task = { id: "1", wedding_id: "w", task: "T", due_date: "", is_completed: false };
        (WeddingChecklistService.addTask as any).mockResolvedValue({ data: task, error: null });
        const { addTask, tasks } = useWeddingChecklist("w");
        await addTask(task);
        expect(tasks.value).toContainEqual(task);
    });

    it("updates task", async () => {
        const task = { id: "1", wedding_id: "w", task: "T", due_date: "", is_completed: false };
        (WeddingChecklistService.updateTask as any).mockResolvedValue({ data: { ...task, is_completed: true }, error: null });
        const { updateTask, tasks } = useWeddingChecklist("w");
        tasks.value = [task];
        await updateTask("1", { is_completed: true });
        expect(tasks.value[0].is_completed).toBe(true);
    });

    it("removes task", async () => {
        (WeddingChecklistService.removeTask as any).mockResolvedValue({ error: null });
        const { removeTask, tasks } = useWeddingChecklist("w");
        tasks.value = [{ id: "1", wedding_id: "w", task: "T", due_date: "", is_completed: false }];
        await removeTask("1");
        expect(tasks.value).toEqual([]);
    });

    it("toggles task completion", async () => {
        const task = { id: "1", wedding_id: "w", task: "T", due_date: "", is_completed: false };
        (WeddingChecklistService.updateTask as any).mockResolvedValue({ data: { ...task, is_completed: true }, error: null });
        const { toggleTaskCompletion, tasks } = useWeddingChecklist("w");
        tasks.value = [task];
        await toggleTaskCompletion("1", false);
        expect(tasks.value[0].is_completed).toBe(true);
    });
});
