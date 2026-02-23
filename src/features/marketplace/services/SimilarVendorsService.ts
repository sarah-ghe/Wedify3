import {
  Vendor,
  VendorService,
} from "@/features/vendors/services/VendorService";
import { VendorRegionService } from "@/features/vendors/services/VendorRegionService";
import { VendorPackageService } from "@/features/vendors/services/VendorPackageService";
import { ServiceTypesService } from "@/features/vendors/services/ServiceTypesService";
import { GetNicheService } from "./getNicheService";

export class SimilarVendorsService {
  static async getSimilarVendors(vendor: Vendor, limit = 5): Promise<Vendor[]> {
    // 1. Fetch all vendors except the current one
    const { data: allVendors } = await VendorService.getAll();
    if (!allVendors) return [];
    let candidates: Vendor[] = allVendors.filter(
      (v: Vendor) => v.id !== vendor.id,
    );

    // 2. Filter by same service type
    candidates = candidates.filter(
      (v: Vendor) => v.service_type_id === vendor.service_type_id,
    );

    // 3. Filter by at least one shared region
    const { data: vendorRegions } = await VendorRegionService.getByVendorId(
      vendor.id,
    );
    const vendorRegionNames = new Set(
      (vendorRegions || []).map((r: any) => r.region_name),
    );
    const regionMap = new Map<string, string[]>();
    for (const v of candidates) {
      const { data: regions } = await VendorRegionService.getByVendorId(v.id);
      regionMap.set(
        v.id,
        (regions || []).map((r: any) => r.region_name),
      );
    }
    candidates = candidates.filter((v: Vendor) =>
      (regionMap.get(v.id) || []).some((region: string) =>
        vendorRegionNames.has(region),
      ),
    );

    // 4. Filter by similar price range (±20% of min package price)
    const { data: vendorPackages } = await VendorPackageService.getByVendorId(
      vendor.id,
    );
    const minPrice = Math.min(
      ...(vendorPackages || []).map((p: any) => p.price),
    );
    const priceMin = minPrice * 0.8;
    const priceMax = minPrice * 1.2;
    const packageMap = new Map<string, number>();
    for (const v of candidates) {
      const { data: pkgs } = await VendorPackageService.getByVendorId(v.id);
      if (pkgs && pkgs.length) {
        packageMap.set(v.id, Math.min(...pkgs.map((p: any) => p.price)));
      }
    }
    candidates = candidates.filter((v: Vendor) => {
      const price = packageMap.get(v.id);
      return price !== undefined && price >= priceMin && price <= priceMax;
    });

    // 5. Filter by similar rating (±0.5)
    const rating = vendor.rating ?? 0;
    candidates = candidates.filter(
      (v: Vendor) =>
        v.rating !== undefined && Math.abs((v.rating ?? 0) - rating) <= 0.5,
    );

    // 6. Filter by shared niche options (if applicable)
    const { data: serviceType } = await ServiceTypesService.getById(
      vendor.service_type_id,
    );
    if (serviceType) {
      const nicheService = GetNicheService(serviceType.name?.toLowerCase());
      if (nicheService) {
        const { data: vendorNicheArr } = await nicheService.getByVendorId(
          vendor.id,
        );
        const vendorNiche = vendorNicheArr?.[0];
        if (vendorNiche) {
          const nicheFields = Object.keys(vendorNiche).filter(
            (k) =>
              k !== "id" &&
              k !== "vendor_id" &&
              k !== "created_at" &&
              typeof vendorNiche[k] === "boolean",
          );
          const hasSharedNiche = async (candidateId: string) => {
            const { data: candidateNicheArr } =
              await nicheService.getByVendorId(candidateId);
            const candidateNiche = candidateNicheArr?.[0];
            if (!candidateNiche) return false;
            return nicheFields.some((f) => vendorNiche[f] && candidateNiche[f]);
          };
          const filtered: Vendor[] = [];
          for (const v of candidates) {
            if (await hasSharedNiche(v.id)) filtered.push(v);
          }
          candidates = filtered;
        }
      }
    }

    // 7. Sort by rating desc, then by price asc
    candidates.sort(
      (a: Vendor, b: Vendor) =>
        (b.rating ?? 0) - (a.rating ?? 0) ||
        (packageMap.get(a.id) ?? 0) - (packageMap.get(b.id) ?? 0),
    );

    // 8. Limit results
    return candidates.slice(0, limit);
  }
}
