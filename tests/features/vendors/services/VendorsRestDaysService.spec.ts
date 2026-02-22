import { describe, it, expect, vi, beforeEach } from "vitest";
import { VendorsRestDaysService } from "@/features/vendors/services/VendorsRestDaysService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("VendorsRestDaysService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all rest days", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: "rd1", vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorsRestDaysService.getAll();
        expect(data).toEqual([{ id: "rd1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch rest day by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "rd1", vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorsRestDaysService.getById("rd1");
        expect(data).toEqual({ id: "rd1", vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should fetch rest days by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: "rd1", vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorsRestDaysService.getByVendorId("v1");
        expect(data).toEqual([{ id: "rd1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should create a rest day", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "rd1", vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorsRestDaysService.create({ vendor_id: "v1", day_of_week: "Monday" });
        expect(data).toEqual({ id: "rd1", vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch rest days", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: "rd1", vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorsRestDaysService.createBatch([{ vendor_id: "v1", day_of_week: "Monday" }]);
        expect(data).toEqual([{ id: "rd1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a rest day", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: "rd1", day_of_week: "Tuesday" }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await VendorsRestDaysService.update("rd1", { day_of_week: "Tuesday" });
        expect(data).toEqual({ id: "rd1", day_of_week: "Tuesday" });
        expect(error).toBeNull();
    });

    it("should delete a rest day", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorsRestDaysService.delete("rd1");
        expect(error).toBeNull();
    });

    it("should delete rest days by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorsRestDaysService.deleteByVendorId("v1");
        expect(error).toBeNull();
    });
});
