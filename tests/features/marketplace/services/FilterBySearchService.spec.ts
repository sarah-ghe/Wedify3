import { describe, it, expect } from "vitest";
import { filterBySearch } from "@/features/marketplace/services/FilterBySearchService";
import { Vendor } from "@/features/vendors/services/VendorService";

const vendors: Vendor[] = [
    {
        id: "1",
        user_id: "u1",
        business_name: "Elegant Events",
        created_at: "",
        service_type_id: "s1",
        description: "Best wedding planner in town",
    },
    {
        id: "2",
        user_id: "u2",
        business_name: "Floral Fantasy",
        created_at: "",
        service_type_id: "s2",
        description: "Beautiful bouquets and arrangements",
    },
    {
        id: "3",
        user_id: "u3",
        business_name: "DJ Max",
        created_at: "",
        service_type_id: "s3",
    },
];

describe("filterBySearch", () => {
    it("returns all vendors if search is undefined", async () => {
        const result = await filterBySearch(vendors, undefined);
        expect(result).toEqual(vendors);
    });

    it("returns all vendors if search is empty string", async () => {
        const result = await filterBySearch(vendors, "");
        expect(result).toEqual(vendors);
    });

    it("filters vendors by business_name (case-insensitive)", async () => {
        const result = await filterBySearch(vendors, "elegant");
        expect(result.map(v => v.id)).toEqual(["1"]);
        const result2 = await filterBySearch(vendors, "DJ MAX");
        expect(result2.map(v => v.id)).toEqual(["3"]);
    });

    it("filters vendors by description (case-insensitive)", async () => {
        const result = await filterBySearch(vendors, "bouquets");
        expect(result.map(v => v.id)).toEqual(["2"]);
        const result2 = await filterBySearch(vendors, "WEDDING PLANNER");
        expect(result2.map(v => v.id)).toEqual(["1"]);
    });

    it("returns empty array if no vendors match", async () => {
        const result = await filterBySearch(vendors, "notfound");
        expect(result).toEqual([]);
    });

    it("does not throw if description is missing", async () => {
        const result = await filterBySearch(vendors, "dj");
        expect(result.map(v => v.id)).toEqual(["3"]);
    });
});
