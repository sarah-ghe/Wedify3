import { describe, it, expect, vi, beforeEach } from "vitest";
import { ServiceTypesService } from "@/features/vendors/services/ServiceTypesService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("ServiceTypesService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all service types", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: "1", name: "beauty" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypesService.getAll();
        expect(data).toEqual([{ id: "1", name: "beauty" }]);
        expect(error).toBeNull();
    });

    it("should fetch service type by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "1", name: "beauty" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypesService.getById("1");
        expect(data).toEqual({ id: "1", name: "beauty" });
        expect(error).toBeNull();
    });

    it("should fetch service type by name", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "1", name: "beauty" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypesService.getByName("beauty");
        expect(data).toEqual({ id: "1", name: "beauty" });
        expect(error).toBeNull();
    });
});
