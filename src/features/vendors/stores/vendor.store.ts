import { defineStore } from "pinia";
import { Vendor } from "@/features/vendors/services/VendorService";

export const useVendorStore = defineStore("vendor", {
  state: () => ({
    vendors: [] as Vendor[],
    selectedVendorId: null as string | null,
  }),
  actions: {
    setVendors(vendors: Vendor[]) {
      this.vendors = vendors;
    },
    selectVendor(vendorId: string) {
      this.selectedVendorId = vendorId;
    },
    clearVendors() {
      this.vendors = [];
      this.selectedVendorId = null;
    },
  },
});
