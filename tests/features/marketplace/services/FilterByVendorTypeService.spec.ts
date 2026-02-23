import { describe, it, expect } from "vitest";
import { filterByVendorType } from "@/features/marketplace/services/FilterByVendorTypeService";

const vendors = [
    { id: "1", service_type_id: "beauty" },
    { id: "2", service_type_id: "music" },
    { id: "3", service_type_id: "beauty" },
];

describe("filterByVendorType", () => {
    it("returns all vendors if vendorType is undefined", async () => {
        const result = await filterByVendorType(vendors, undefined);
        expect(result).toEqual(vendors);
    });

    it("returns all vendors if vendorType is null", async () => {
        const result = await filterByVendorType(vendors, null as any);
        expect(result).toEqual(vendors);
    });

    it("filters vendors by matching service_type_id", async () => {
        const result = await filterByVendorType(vendors, "beauty");
        expect(result.map(v => v.id).sort()).toEqual(["1", "3"]);
    });

    it("filters vendors by non-matching service_type_id", async () => {
        const result = await filterByVendorType(vendors, "music");
        expect(result.map(v => v.id)).toEqual(["2"]);
    });

    it("returns empty array if no vendors match the vendorType", async () => {
        const result = await filterByVendorType(vendors, "organizer");
        expect(result).toEqual([]);
    });
});
