import { describe, it, expect, vi, beforeEach } from "vitest";
import { useVendorPackageManagement } from "@/features/vendors/composables/useVendorPackageManagement";
import { VendorPackageService } from "@/features/vendors/services/VendorPackageService";

vi.mock("@/features/vendors/services/VendorPackageService");

describe("useVendorPackageManagement", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create a package", async () => {
        const pkg = { vendor_id: "v1", name: "Premium", price: 200, features: {}, is_daily_booking: false };
        vi.mocked(VendorPackageService.create).mockResolvedValue({ data: { ...pkg, id: "p2" }, error: null });

        const { createPackage, packages, error } = useVendorPackageManagement("v1");
        await createPackage(pkg);

        expect(packages.value.length).toBe(1);
        expect(packages.value[0].name).toBe("Premium");
        expect(error.value).toBeNull();
    });

    it("should update a package", async () => {
        const pkg = { id: "p1", vendor_id: "v1", name: "Basic", price: 100, features: {}, is_daily_booking: true };
        vi.mocked(VendorPackageService.update).mockResolvedValue({ data: { ...pkg, name: "Updated" }, error: null });

        const { packages, updatePackage, error } = useVendorPackageManagement("v1");
        packages.value = [pkg];
        await updatePackage("p1", { name: "Updated" });

        expect(packages.value[0].name).toBe("Updated");
        expect(error.value).toBeNull();
    });

    it("should delete a package", async () => {
        vi.mocked(VendorPackageService.delete).mockResolvedValue({ error: null });

        const { packages, deletePackage, error } = useVendorPackageManagement("v1");
        packages.value = [{ id: "p1", vendor_id: "v1", name: "Basic", price: 100, features: {}, is_daily_booking: true }];
        await deletePackage("p1");

        expect(packages.value.length).toBe(0);
        expect(error.value).toBeNull();
    });
});
