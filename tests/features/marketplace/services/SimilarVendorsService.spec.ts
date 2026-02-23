import { describe, it, expect, vi, beforeEach } from "vitest";
import { SimilarVendorsService } from "@/features/marketplace/services/SimilarVendorsService";
import * as VendorServiceModule from "@/features/vendors/services/VendorService";
import * as VendorRegionServiceModule from "@/features/vendors/services/VendorRegionService";
import * as VendorPackageServiceModule from "@/features/vendors/services/VendorPackageService";
import * as ServiceTypesServiceModule from "@/features/vendors/services/ServiceTypesService";
import * as GetNicheServiceModule from "@/features/marketplace/services/getNicheService";

// Helper mock class with all static methods
class MockNicheService {
    static getByVendorId = vi.fn();
    static getAll = vi.fn();
    static getById = vi.fn();
    static create = vi.fn();
    static createBatch = vi.fn();
    static update = vi.fn();
    static delete = vi.fn();
    static deleteBatch = vi.fn();
    static deleteByVendorId = vi.fn();
}

describe("SimilarVendorsService.getSimilarVendors", () => {
    const vendor = { id: "v1", service_type_id: "beauty", rating: 4.5, business_name: "A", created_at: "", user_id: "u", description: "" };
    const otherVendors = [
        { id: "v2", service_type_id: "beauty", rating: 4.5, business_name: "B", created_at: "", user_id: "u2", description: "" },
        { id: "v3", service_type_id: "beauty", rating: 4.0, business_name: "C", created_at: "", user_id: "u3", description: "" },
        { id: "v4", service_type_id: "music", rating: 4.5, business_name: "D", created_at: "", user_id: "u4", description: "" },
        { id: "v5", service_type_id: "beauty", rating: 5.0, business_name: "E", created_at: "", user_id: "u5", description: "" },
    ];

    beforeEach(() => {
        vi.resetAllMocks();
        vi.spyOn(VendorServiceModule.VendorService, "getAll").mockResolvedValue({ data: [vendor, ...otherVendors], error: null });
        vi.spyOn(VendorRegionServiceModule.VendorRegionService, "getByVendorId").mockImplementation(async (id) => {
            return { data: [{ region_name: "R1" }], error: null };
        });
        vi.spyOn(VendorPackageServiceModule.VendorPackageService, "getByVendorId").mockImplementation(async (id) => {
            return { data: [{ price: 100 }], error: null };
        });
        vi.spyOn(ServiceTypesServiceModule.ServiceTypesService, "getById").mockResolvedValue({ data: { id: "beauty", name: "beauty" }, error: null });
        vi.spyOn(GetNicheServiceModule, "GetNicheService").mockImplementation(() => {
            MockNicheService.getByVendorId.mockImplementation(async (id) => {
                return { data: [{ hair_styling: true, makeup: false, id: 1, vendor_id: id, created_at: "" }], error: null };
            });
            return MockNicheService;
        });
    });

    it("returns empty if no vendors", async () => {
        vi.spyOn(VendorServiceModule.VendorService, "getAll").mockResolvedValue({ data: null, error: null });
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(result).toEqual([]);
    });

    it("filters out self from candidates", async () => {
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(result.every(v => v.id !== vendor.id)).toBe(true);
    });

    it("filters by same service type", async () => {
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(result.every(v => v.service_type_id === vendor.service_type_id)).toBe(true);
    });

    it("filters by shared region", async () => {
        vi.spyOn(VendorRegionServiceModule.VendorRegionService, "getByVendorId").mockImplementation(async (id) => {
            if (id === "v1") return { data: [{ region_name: "R1" }], error: null };
            if (id === "v3") return { data: [{ region_name: "R2" }], error: null };
            return { data: [{ region_name: "R1" }], error: null };
        });
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(result.some(v => v.id === "v3")).toBe(false);
    });

    it("filters by similar price range", async () => {
        vi.spyOn(VendorPackageServiceModule.VendorPackageService, "getByVendorId").mockImplementation(async (id) => {
            if (id === "v5") return { data: [{ price: 200 }], error: null };
            return { data: [{ price: 100 }], error: null };
        });
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(result.some(v => v.id === "v5")).toBe(false);
    });

    it("filters by similar rating", async () => {
        // Set v3's rating to 3.9 so it's outside the ±0.5 range
        otherVendors[1].rating = 3.9;
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(result.some(v => v.id === "v3")).toBe(false);
    });

    it("filters by shared niche options", async () => {
        vi.spyOn(GetNicheServiceModule, "GetNicheService").mockImplementation(() => {
            MockNicheService.getByVendorId.mockImplementation(async (id) => {
                if (id === "v1" || id === "v2") return { data: [{ hair_styling: true, id: 1, vendor_id: id, created_at: "" }], error: null };
                return { data: [{ hair_styling: false, id: 1, vendor_id: id, created_at: "" }], error: null };
            });
            return MockNicheService;
        });
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(result.some(v => v.id === "v2")).toBe(true);
        expect(result.some(v => v.id === "v5")).toBe(false);
    });

    it("skips niche filter if no service type", async () => {
        vi.spyOn(ServiceTypesServiceModule.ServiceTypesService, "getById").mockResolvedValue({ data: null, error: null });
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(Array.isArray(result)).toBe(true);
    });

    it("skips niche filter if no niche service", async () => {
        vi.spyOn(ServiceTypesServiceModule.ServiceTypesService, "getById").mockResolvedValue({ data: { id: "beauty", name: "beauty" }, error: null });
        vi.spyOn(GetNicheServiceModule, "GetNicheService").mockReturnValue(null);
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(Array.isArray(result)).toBe(true);
    });

    it("skips niche filter if no vendor niche", async () => {
        vi.spyOn(GetNicheServiceModule, "GetNicheService").mockImplementation(() => {
            MockNicheService.getByVendorId.mockImplementation(async (id) => ({ data: [], error: null }));
            return MockNicheService;
        });
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        expect(Array.isArray(result)).toBe(true);
    });

    it("sorts by rating desc, then price asc", async () => {
        vi.spyOn(VendorPackageServiceModule.VendorPackageService, "getByVendorId").mockImplementation(async (id) => {
            if (id === "v5") return { data: [{ price: 90 }], error: null };
            return { data: [{ price: 100 }], error: null };
        });
        const result = await SimilarVendorsService.getSimilarVendors(vendor, 5);
        const v5Index = result.findIndex(v => v.id === "v5");
        const v2Index = result.findIndex(v => v.id === "v2");
        expect(v5Index).toBeLessThan(v2Index);
    });

    it("limits the number of results", async () => {
        const manyVendors = [];
        for (let i = 2; i <= 10; i++) {
            manyVendors.push({ id: `v${i}`, service_type_id: "beauty", rating: 4.5, business_name: `B${i}`, created_at: "", user_id: `u${i}`, description: "" });
        }
        vi.spyOn(VendorServiceModule.VendorService, "getAll").mockResolvedValue({ data: [vendor, ...manyVendors], error: null });

        // Ensure all vendors share the same region
        vi.spyOn(VendorRegionServiceModule.VendorRegionService, "getByVendorId").mockImplementation(async (id) => {
            return { data: [{ region_name: "R1" }], error: null };
        });

        // Ensure all vendors have the same package price
        vi.spyOn(VendorPackageServiceModule.VendorPackageService, "getByVendorId").mockImplementation(async (id) => {
            return { data: [{ price: 100 }], error: null };
        });

        // Ensure all vendors have the same niche (hair_styling: true)
        MockNicheService.getByVendorId.mockImplementation(async (id) => {
            return { data: [{ hair_styling: true, makeup: false, id: 1, vendor_id: id, created_at: "" }], error: null };
        });

        const result = await SimilarVendorsService.getSimilarVendors(vendor, 3);
        expect(result.length).toBe(3);
    });

});
