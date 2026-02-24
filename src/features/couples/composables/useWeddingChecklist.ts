import { ref } from "vue";
import { CoupleTasks } from "@/features/shared/types/types";
import { WeddingChecklistService } from "@/features/couples/services/WeddingChecklistService";

export function useWeddingChecklist(weddingId: string) {
  const tasks = ref<CoupleTasks[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    const { data, error: err } =
      await WeddingChecklistService.getByWeddingId(weddingId);
    if (err) error.value = err.message;
    tasks.value = data || [];
    loading.value = false;
  }

  async function addTask(task: Omit<CoupleTasks, "id">) {
    loading.value = true;
    error.value = null;
    const { data, error: err } = await WeddingChecklistService.addTask(task);
    if (err) error.value = err.message;
    if (data) tasks.value.push(data);
    loading.value = false;
  }

  async function updateTask(
    id: string,
    updates: Partial<Omit<CoupleTasks, "id" | "wedding_id">>,
  ) {
    loading.value = true;
    error.value = null;
    const { data, error: err } = await WeddingChecklistService.updateTask(
      id,
      updates,
    );
    if (err) error.value = err.message;
    if (data) {
      const idx = tasks.value.findIndex((t) => t.id === id);
      if (idx !== -1) tasks.value[idx] = data;
    }
    loading.value = false;
  }

  async function removeTask(id: string) {
    loading.value = true;
    error.value = null;
    const { error: err } = await WeddingChecklistService.removeTask(id);
    if (err) error.value = err.message;
    tasks.value = tasks.value.filter((t) => t.id !== id);
    loading.value = false;
  }

  async function toggleTaskCompletion(id: string, current: boolean) {
    await updateTask(id, { is_completed: !current });
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    removeTask,
    toggleTaskCompletion,
  };
}
