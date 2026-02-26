import { describe, it, expect, beforeEach } from "vitest";
import { useVendorStore } from "@/features/vendors/composables/vendorStore";
import {createPinia, setActivePinia} from "pinia";

describe("useVendorStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    it("should set vendors", () => {
        const store = useVendorStore();
        const vendors = [{ id: "v1", user_id: "u1", business_name: "Test", service_type_id: "beauty", created_at: "" }];
        store.setVendors(vendors);
        expect(store.vendors).toEqual(vendors);
    });

    it("should select vendor", () => {
        const store = useVendorStore();
        store.selectVendor("v1");
        expect(store.selectedVendorId).toBe("v1");
    });

    it("should clear vendors", () => {
        const store = useVendorStore();
        store.vendors = [{ id: "v1", user_id: "u1", business_name: "Test", service_type_id: "beauty", created_at: "" }];
        store.selectedVendorId = "v1";
        store.clearVendors();
        expect(store.vendors).toEqual([]);
        expect(store.selectedVendorId).toBeNull();
    });
});
