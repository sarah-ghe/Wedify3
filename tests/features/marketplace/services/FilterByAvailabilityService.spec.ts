import { describe, it, expect, vi, beforeEach } from "vitest";
import { filterByAvailability } from "@/features/marketplace/services/FilterByAvailabilityService";
import { VendorsRestDaysService } from "@/features/vendors/services/VendorsRestDaysService";
import { VendorUnavailableDatesService } from "@/features/vendors/services/VendorUnavailableDatesService";
import { Vendor } from "@/features/vendors/services/VendorService";

vi.mock("@/features/vendors/services/VendorsRestDaysService", () => ({
    VendorsRestDaysService: {
        getBySetOfIds: vi.fn(),
    },
}));
vi.mock("@/features/vendors/services/VendorUnavailableDatesService", () => ({
    VendorUnavailableDatesService: {
        getBySetOfIds: vi.fn(),
    },
}));

const vendors: Vendor[] = [
    { id: "1", user_id: "u1", business_name: "A", created_at: "", service_type_id: "s1" },
    { id: "2", user_id: "u2", business_name: "B", created_at: "", service_type_id: "s2" },
    { id: "3", user_id: "u3", business_name: "C", created_at: "", service_type_id: "s3" },
];

describe("filterByAvailability", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns all vendors if no date is provided", async () => {
        const result = await filterByAvailability(vendors, undefined);
        expect(result).toEqual(vendors);
    });

    it("filters out vendors unavailable on the given date (rest day and unavailable date)", async () => {
        // Monday, 2024-06-10
        (VendorsRestDaysService.getBySetOfIds as any).mockResolvedValue({
            data: [
                { vendor_id: "2", day_of_week: "Monday" }, // Vendor 2 is off on Monday
            ],
        });
        (VendorUnavailableDatesService.getBySetOfIds as any).mockResolvedValue({
            data: [
                { vendor_id: "3", date: "2024-06-10" }, // Vendor 3 is unavailable on this date
            ],
        });

        const result = await filterByAvailability(vendors, "2024-06-10");
        expect(result.map((v) => v.id)).toEqual(["1"]);
    });

    it("filters out vendors unavailable by rest day only", async () => {
        (VendorsRestDaysService.getBySetOfIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", day_of_week: "Tuesday" },
                { vendor_id: "2", day_of_week: "Tuesday" },
            ],
        });
        (VendorUnavailableDatesService.getBySetOfIds as any).mockResolvedValue({
            data: [],
        });

        const result = await filterByAvailability(vendors, "2024-06-11"); // Tuesday
        expect(result.map((v) => v.id)).toEqual(["3"]);
    });

    it("filters out vendors unavailable by unavailable date only", async () => {
        (VendorsRestDaysService.getBySetOfIds as any).mockResolvedValue({
            data: [],
        });
        (VendorUnavailableDatesService.getBySetOfIds as any).mockResolvedValue({
            data: [
                { vendor_id: "2", date: "2024-06-12" },
            ],
        });

        const result = await filterByAvailability(vendors, "2024-06-12");
        expect(result.map((v) => v.id)).toEqual(["1", "3"]);
    });

    it("returns all vendors if none are unavailable", async () => {
        (VendorsRestDaysService.getBySetOfIds as any).mockResolvedValue({ data: [] });
        (VendorUnavailableDatesService.getBySetOfIds as any).mockResolvedValue({ data: [] });

        const result = await filterByAvailability(vendors, "2024-06-13");
        expect(result).toEqual(vendors);
    });

    it("returns empty array if all vendors are unavailable (both reasons)", async () => {
        (VendorsRestDaysService.getBySetOfIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", day_of_week: "Friday" },
                { vendor_id: "2", day_of_week: "Friday" },
                { vendor_id: "3", day_of_week: "Friday" },
            ],
        });
        (VendorUnavailableDatesService.getBySetOfIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", date: "2024-06-14" },
                { vendor_id: "2", date: "2024-06-14" },
                { vendor_id: "3", date: "2024-06-14" },
            ],
        });

        const result = await filterByAvailability(vendors, "2024-06-14"); // Friday
        expect(result).toEqual([]);
    });

    it("handles null/undefined restDays and unavailableDates gracefully", async () => {
        (VendorsRestDaysService.getBySetOfIds as any).mockResolvedValue({ data: null });
        (VendorUnavailableDatesService.getBySetOfIds as any).mockResolvedValue({ data: undefined });

        const result = await filterByAvailability(vendors, "2024-06-15");
        expect(result).toEqual(vendors);
    });
});
