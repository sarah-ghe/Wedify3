import { describe, it, expect, vi, beforeEach } from "vitest";
import { filterByServiceTypeOptions } from "@/features/marketplace/services/FilterByServiceTypeOptionsService";
import { ServiceTypeBeautyOptionsService } from "@/features/vendors/services/ServiceTypeBeautyOptionsService";
import { ServiceTypeClothingOptionsDzService } from "@/features/vendors/services/ServiceTypeClothingOptionsDzService";
import { ServiceTypeMusicOptionsDzService } from "@/features/vendors/services/ServiceTypeMusicOptionsDzService";
import { ServiceTypeOrganizerOptionsService } from "@/features/vendors/services/ServiceTypeOrganizerOptionsService";
import { ServiceTypeSavoryOptionsService } from "@/features/vendors/services/ServiceTypeSavoryOptionsService";
import { ServiceTypeTransportOptionsService } from "@/features/vendors/services/ServiceTypeTransportOptionsService";
import { ServiceTypeVenueOptionsService } from "@/features/vendors/services/ServiceTypeVenueOptionsService";

vi.mock("@/features/vendors/services/ServiceTypeBeautyOptionsService", () => ({
    ServiceTypeBeautyOptionsService: { getAll: vi.fn() }
}));
vi.mock("@/features/vendors/services/ServiceTypeClothingOptionsDzService", () => ({
    ServiceTypeClothingOptionsDzService: { getAll: vi.fn() }
}));
vi.mock("@/features/vendors/services/ServiceTypeMusicOptionsDzService", () => ({
    ServiceTypeMusicOptionsDzService: { getAll: vi.fn() }
}));
vi.mock("@/features/vendors/services/ServiceTypeOrganizerOptionsService", () => ({
    ServiceTypeOrganizerOptionsService: { getAll: vi.fn() }
}));
vi.mock("@/features/vendors/services/ServiceTypeSavoryOptionsService", () => ({
    ServiceTypeSavoryOptionsService: { getAll: vi.fn() }
}));
vi.mock("@/features/vendors/services/ServiceTypeTransportOptionsService", () => ({
    ServiceTypeTransportOptionsService: { getAll: vi.fn() }
}));
vi.mock("@/features/vendors/services/ServiceTypeVenueOptionsService", () => ({
    ServiceTypeVenueOptionsService: { getAll: vi.fn() }
}));

const vendors = [
    { id: "1", business_name: "A" },
    { id: "2", business_name: "B" },
    { id: "3", business_name: "C" },
];

describe("filterByServiceTypeOptions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns all vendors if serviceType is undefined", async () => {
        const result = await filterByServiceTypeOptions(vendors, undefined, undefined);
        expect(result).toEqual(vendors);
    });

    it("returns all vendors if serviceType is null", async () => {
        const result = await filterByServiceTypeOptions(vendors, null as any, undefined);
        expect(result).toEqual(vendors);
    });

    it("returns all vendors for unknown serviceType (default case)", async () => {
        const result = await filterByServiceTypeOptions(vendors, "unknown", undefined);
        expect(result).toEqual(vendors);
    });

    it("filters vendors for 'beauty' serviceType", async () => {
        (ServiceTypeBeautyOptionsService.getAll as any).mockResolvedValue({ data: [{ vendor_id: "1" }, { vendor_id: "3" }] });
        const result = await filterByServiceTypeOptions(vendors, "beauty", undefined);
        expect(result.map(v => v.id).sort()).toEqual(["1", "3"]);
    });

    it("filters vendors for 'clothing' serviceType", async () => {
        (ServiceTypeClothingOptionsDzService.getAll as any).mockResolvedValue({ data: [{ vendor_id: "2" }] });
        const result = await filterByServiceTypeOptions(vendors, "clothing", undefined);
        expect(result.map(v => v.id)).toEqual(["2"]);
    });

    it("filters vendors for 'music' serviceType", async () => {
        (ServiceTypeMusicOptionsDzService.getAll as any).mockResolvedValue({ data: [{ vendor_id: "3" }] });
        const result = await filterByServiceTypeOptions(vendors, "music", undefined);
        expect(result.map(v => v.id)).toEqual(["3"]);
    });

    it("filters vendors for 'organizer' serviceType", async () => {
        (ServiceTypeOrganizerOptionsService.getAll as any).mockResolvedValue({ data: [{ vendor_id: "1" }] });
        const result = await filterByServiceTypeOptions(vendors, "organizer", undefined);
        expect(result.map(v => v.id)).toEqual(["1"]);
    });

    it("filters vendors for 'savory' serviceType", async () => {
        (ServiceTypeSavoryOptionsService.getAll as any).mockResolvedValue({ data: [{ vendor_id: "2" }] });
        const result = await filterByServiceTypeOptions(vendors, "savory", undefined);
        expect(result.map(v => v.id)).toEqual(["2"]);
    });

    it("filters vendors for 'transport' serviceType", async () => {
        (ServiceTypeTransportOptionsService.getAll as any).mockResolvedValue({ data: [{ vendor_id: "1" }, { vendor_id: "2" }] });
        const result = await filterByServiceTypeOptions(vendors, "transport", undefined);
        expect(result.map(v => v.id).sort()).toEqual(["1", "2"]);
    });

    it("filters vendors for 'venue' serviceType", async () => {
        (ServiceTypeVenueOptionsService.getAll as any).mockResolvedValue({ data: [{ vendor_id: "3" }] });
        const result = await filterByServiceTypeOptions(vendors, "venue", undefined);
        expect(result.map(v => v.id)).toEqual(["3"]);
    });

    it("returns empty array if no vendor matches", async () => {
        (ServiceTypeBeautyOptionsService.getAll as any).mockResolvedValue({ data: [{ vendor_id: "999" }] });
        const result = await filterByServiceTypeOptions(vendors, "beauty", undefined);
        expect(result).toEqual([]);
    });

    it("handles empty optionsData (empty array)", async () => {
        (ServiceTypeBeautyOptionsService.getAll as any).mockResolvedValue({ data: [] });
        const result = await filterByServiceTypeOptions(vendors, "beauty", undefined);
        expect(result).toEqual([]);
    });

    it("handles undefined optionsData", async () => {
        (ServiceTypeBeautyOptionsService.getAll as any).mockResolvedValue({ data: undefined });
        const result = await filterByServiceTypeOptions(vendors, "beauty", undefined);
        expect(result).toEqual([]);
    });

    it("is case-insensitive for serviceType", async () => {
        (ServiceTypeBeautyOptionsService.getAll as any).mockResolvedValue({ data: [{ vendor_id: "1" }] });
        const result = await filterByServiceTypeOptions(vendors, "BeAuTy", undefined);
        expect(result.map(v => v.id)).toEqual(["1"]);
    });

    it("filters by selectedOptions if provided", async () => {
        (ServiceTypeBeautyOptionsService.getAll as any).mockResolvedValue({
            data: [
                { vendor_id: "1", hair_styling: true, makeup: false },
                { vendor_id: "2", hair_styling: true, makeup: true },
                { vendor_id: "3", hair_styling: false, makeup: true },
            ]
        });
        // Only vendor 2 matches both hair_styling: true and makeup: true
        const result = await filterByServiceTypeOptions(
            vendors,
            "beauty",
            { hair_styling: true, makeup: true }
        );
        expect(result.map(v => v.id)).toEqual(["2"]);
    });

    it("returns all vendors matching vendor_id if selectedOptions is empty", async () => {
        (ServiceTypeBeautyOptionsService.getAll as any).mockResolvedValue({
            data: [
                { vendor_id: "1", hair_styling: true },
                { vendor_id: "2", hair_styling: false },
            ]
        });
        const result = await filterByServiceTypeOptions(
            vendors,
            "beauty",
            {}
        );
        expect(result.map(v => v.id).sort()).toEqual(["1", "2"]);
    });
});
