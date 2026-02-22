import { describe, it, expect, vi, beforeEach } from "vitest";
import { VendorService } from "@/features/vendors/services/VendorService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("VendorService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all vendors", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: "v1", user_id: "u1" }], error: null }),
        } as any);

        const { data, error } = await VendorService.getAll();
        expect(data).toEqual([{ id: "v1", user_id: "u1" }]);
        expect(error).toBeNull();
    });

    it("should fetch vendor by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "v1", user_id: "u1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorService.getById("v1");
        expect(data).toEqual({ id: "v1", user_id: "u1" });
        expect(error).toBeNull();
    });

    it("should create a vendor", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "v1", user_id: "u1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorService.create({ user_id: "u1", business_name: "Test", service_type_id: "beauty" });
        expect(data).toEqual({ id: "v1", user_id: "u1" });
        expect(error).toBeNull();
    });

    it("should update a vendor", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: "v1", business_name: "Updated" }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await VendorService.update("v1", { business_name: "Updated" });
        expect(data).toEqual({ id: "v1", business_name: "Updated" });
        expect(error).toBeNull();
    });

    it("should delete a vendor", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorService.delete("v1");
        expect(error).toBeNull();
    });
});
