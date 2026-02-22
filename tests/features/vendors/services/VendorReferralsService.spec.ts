import { describe, it, expect, vi, beforeEach } from "vitest";
import { VendorReferralsService } from "@/features/vendors/services/VendorReferralsService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("VendorReferralsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all vendor referrals", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: "r1", from_vendor_id: "v1", to_vendor_id: "v2", booking_id: "b1" }], error: null }),
        } as any);

        const { data, error } = await VendorReferralsService.getAll();
        expect(data).toEqual([{ id: "r1", from_vendor_id: "v1", to_vendor_id: "v2", booking_id: "b1" }]);
        expect(error).toBeNull();
    });

    it("should fetch vendor referral by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "r1", from_vendor_id: "v1", to_vendor_id: "v2", booking_id: "b1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorReferralsService.getById("r1");
        expect(data).toEqual({ id: "r1", from_vendor_id: "v1", to_vendor_id: "v2", booking_id: "b1" });
        expect(error).toBeNull();
    });

    it("should fetch referrals by from_vendor_id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: "r1", from_vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorReferralsService.getByFromVendorId("v1");
        expect(data).toEqual([{ id: "r1", from_vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch referrals by to_vendor_id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: "r1", to_vendor_id: "v2" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorReferralsService.getByToVendorId("v2");
        expect(data).toEqual([{ id: "r1", to_vendor_id: "v2" }]);
        expect(error).toBeNull();
    });

    it("should create a vendor referral", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "r1", from_vendor_id: "v1", to_vendor_id: "v2", booking_id: "b1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorReferralsService.create({ from_vendor_id: "v1", to_vendor_id: "v2", booking_id: "b1" });
        expect(data).toEqual({ id: "r1", from_vendor_id: "v1", to_vendor_id: "v2", booking_id: "b1" });
        expect(error).toBeNull();
    });

    it("should create batch vendor referrals", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: "r1", from_vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorReferralsService.createBatch([{ from_vendor_id: "v1", to_vendor_id: "v2", booking_id: "b1" }]);
        expect(data).toEqual([{ id: "r1", from_vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a vendor referral", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: "r1", note: "Updated" }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await VendorReferralsService.update("r1", { note: "Updated" });
        expect(data).toEqual({ id: "r1", note: "Updated" });
        expect(error).toBeNull();
    });

    it("should delete a vendor referral", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorReferralsService.delete("r1");
        expect(error).toBeNull();
    });

    it("should delete batch vendor referrals", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorReferralsService.deleteBatch(["r1", "r2"]);
        expect(error).toBeNull();
    });

    it("should delete referrals by from_vendor_id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorReferralsService.deleteByFromVendorId("v1");
        expect(error).toBeNull();
    });

    it("should delete referrals by to_vendor_id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorReferralsService.deleteByToVendorId("v2");
        expect(error).toBeNull();
    });
});
