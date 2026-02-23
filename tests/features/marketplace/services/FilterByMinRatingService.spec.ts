import { describe, it, expect } from "vitest";
import { filterByMinRating } from "@/features/marketplace/services/FilterByMinRatingService";
import { Vendor } from "@/features/vendors/services/VendorService";

const vendors: Vendor[] = [
    { id: "1", user_id: "u1", business_name: "A", created_at: "", service_type_id: "s1", rating: 4.5 },
    { id: "2", user_id: "u2", business_name: "B", created_at: "", service_type_id: "s2", rating: 3.9 },
    { id: "3", user_id: "u3", business_name: "C", created_at: "", service_type_id: "s3" }, // no rating
    { id: "4", user_id: "u4", business_name: "D", created_at: "", service_type_id: "s4", rating: 5 },
];

describe("filterByMinRating", () => {
    it("returns all vendors if minRating is undefined", async () => {
        const result = await filterByMinRating(vendors, undefined);
        expect(result).toEqual(vendors);
    });

    it("returns all vendors if minRating is null", async () => {
        const result = await filterByMinRating(vendors, null as any);
        expect(result).toEqual(vendors);
    });

    it("filters vendors with rating >= minRating", async () => {
        const result = await filterByMinRating(vendors, 4);
        expect(result.map(v => v.id)).toEqual(["1", "4"]);
    });

    it("filters vendors with rating >= minRating, including edge", async () => {
        const result = await filterByMinRating(vendors, 5);
        expect(result.map(v => v.id)).toEqual(["4"]);
    });

    it("returns empty array if no vendors meet minRating", async () => {
        const result = await filterByMinRating(vendors, 6);
        expect(result).toEqual([]);
    });

    it("treats vendors with undefined rating as 0", async () => {
        const result = await filterByMinRating(vendors, 0);
        expect(result.map(v => v.id)).toEqual(["1", "2", "3", "4"]);
        const result2 = await filterByMinRating(vendors, 0.1);
        expect(result2.map(v => v.id)).toEqual(["1", "2", "4"]);
    });
});
