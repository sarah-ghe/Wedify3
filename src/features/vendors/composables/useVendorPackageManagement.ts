import { ref } from "vue";
import {
  VendorPackage,
  VendorPackageService,
} from "@/features/vendors/services/VendorPackageService";

export function useVendorPackageManagement(vendorId: string) {
  const packages = ref<VendorPackage[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchPackagesByVendorId() {
    loading.value = true;
    error.value = null;
    const { data, error: fetchError } =
      await VendorPackageService.getByVendorId(vendorId);
    if (fetchError) {
      error.value = "Failed to fetch packages";
    } else {
      packages.value = data || [];
    }
    loading.value = false;
  }

  async function createPackage(pkg: Omit<VendorPackage, "id">) {
    loading.value = true;
    error.value = null;
    const { data, error: createError } = await VendorPackageService.create(pkg);
    if (createError) {
      error.value = "Failed to create package";
    } else {
      packages.value.push(data);
    }
    loading.value = false;
  }

  async function updatePackage(
    id: string,
    updates: Partial<Omit<VendorPackage, "id">>,
  ) {
    loading.value = true;
    error.value = null;
    const { data, error: updateError } = await VendorPackageService.update(
      id,
      updates,
    );
    if (updateError) {
      error.value = "Failed to update package";
    } else {
      const idx = packages.value.findIndex((p) => p.id === id);
      if (idx !== -1) packages.value[idx] = data;
    }
    loading.value = false;
  }

  async function deletePackage(id: string) {
    loading.value = true;
    error.value = null;
    const { error: deleteError } = await VendorPackageService.delete(id);
    if (deleteError) {
      error.value = "Failed to delete package";
    } else {
      packages.value = packages.value.filter((p) => p.id !== id);
    }
    loading.value = false;
  }

  return {
    packages,
    loading,
    error,
    fetchPackagesByVendorId,
    createPackage,
    updatePackage,
    deletePackage,
  };
}
