import { ref } from 'vue';
import { SetupVendorBusinessParams } from '@/lib/types';
import { VendorService } from '@/features/vendors/services/VendorService';
import {VendorRegion, VendorRegionService} from '@/features/vendors/services/VendorRegionService';
import { ServiceTypesService } from '@/features/vendors/services/ServiceTypesService';
import { ServiceTypeBeautyOptionsService } from '@/features/vendors/services/ServiceTypeBeautyOptionsService';
import { ServiceTypeClothingOptionsDzService } from '@/features/vendors/services/ServiceTypeClothingOptionsDzService';
import { ServiceTypeMusicOptionsDzService } from '@/features/vendors/services/ServiceTypeMusicOptionsDzService';
import { ServiceTypeOrganizerOptionsService } from '@/features/vendors/services/ServiceTypeOrganizerOptionsService';
import { ServiceTypeSavoryOptionsService } from '@/features/vendors/services/ServiceTypeSavoryOptionsService';
import { ServiceTypeTransportOptionsService } from '@/features/vendors/services/ServiceTypeTransportOptionsService';
import { ServiceTypeVenueOptionsService } from '@/features/vendors/services/ServiceTypeVenueOptionsService';
import {VendorPackage, VendorPackageService} from '@/features/vendors/services/VendorPackageService';
import {VendorPromotion, VendorPromotionService} from '@/features/vendors/services/VendorPromotionService';
import {VendorsRestDay, VendorsRestDaysService} from '@/features/vendors/services/VendorsRestDaysService';
import {
    VendorsPortfolioTag,
    VendorsPortfolioTagsService
} from '@/features/vendors/services/VendorsPortfolioTagsService';

const NICHES = [
    'beauty',
    'clothing',
    'music',
    'organizer',
    'savory',
    'transport',
    'venue'
];

export function useVendorBusinessSetup() {
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function setupVendorBusiness(params: SetupVendorBusinessParams) {
        const {
            vendorData,
            regions,
            serviceTypeId,
            nicheInfo,
            packages,
            promotions,
            restDays,
            portfolioTags
        } = params;

        loading.value = true;
        error.value = null;
        const stepsDone: Array<() => Promise<void>> = [];
        let vendorId: string | null = null;

        // 1. Vendor creation
        const { data: vendor, error: vendorErr } = await VendorService.create(vendorData);
        if (vendorErr || !vendor) {
            loading.value = false;
            error.value = 'Vendor creation failed';
            return { vendorId, success: false, error: error.value };
        }
        vendorId = vendor.id;
        stepsDone.push(async () => { await VendorService.delete(vendorId!); });

        const updated = updateVendorIdForAll(
            vendorId!,
            regions,
            packages,
            promotions,
            restDays,
            portfolioTags
        );

        // 2. Vendor regions
        if (regions.length) {
            const { error: regionErr } = await VendorRegionService.createBatch(updated.regions);
            if (regionErr) {
                error.value = 'Vendor regions creation failed';
                await rollback(stepsDone);
                loading.value = false;
                return { vendorId, success: false, error: error.value };
            }
            stepsDone.push(async () => { await VendorRegionService.deleteByVendorId(vendorId!); });
        }

        // 3. Niche custom info (using serviceTypeId and nicheInfo)
        const { data: serviceType, error: stErr } = await ServiceTypesService.getById(serviceTypeId);
        if (stErr || !serviceType) {
            error.value = 'Service type fetch failed';
            await rollback(stepsDone);
            loading.value = false;
            return { vendorId, success: false, error: error.value };
        }
        const serviceTypeName = serviceType.name?.toLowerCase();
        if (NICHES.includes(serviceTypeName) && nicheInfo) {
            let customService: any;
            switch (serviceTypeName) {
                case 'beauty':
                    customService = ServiceTypeBeautyOptionsService;
                    break;
                case 'clothing':
                    customService = ServiceTypeClothingOptionsDzService;
                    break;
                case 'music':
                    customService = ServiceTypeMusicOptionsDzService;
                    break;
                case 'organizer':
                    customService = ServiceTypeOrganizerOptionsService;
                    break;
                case 'savory':
                    customService = ServiceTypeSavoryOptionsService;
                    break;
                case 'transport':
                    customService = ServiceTypeTransportOptionsService;
                    break;
                case 'venue':
                    customService = ServiceTypeVenueOptionsService;
                    break;
            }
            if (customService) {
                // Remove id and created_at if present
                const { id, created_at, ...nichePayload } = nicheInfo as any;
                const { error: customErr } = await customService.create({ ...nichePayload, vendor_id: vendorId });
                if (customErr) {
                    error.value = 'Custom info creation failed';
                    await rollback(stepsDone);
                    loading.value = false;
                    return { vendorId, success: false, error: error.value };
                }
                stepsDone.push(async () => { await customService.deleteByVendorId(vendorId!); });
            }
        }

        // 4. Packages
        if (packages.length) {
            const { error: pkgErr } = await VendorPackageService.createBatch(updated.packages);
            if (pkgErr) {
                error.value = 'Packages creation failed';
                await rollback(stepsDone);
                loading.value = false;
                return { vendorId, success: false, error: error.value };
            }
            stepsDone.push(async () => { await VendorPackageService.deleteByVendorId(vendorId!); });
        }

        // 5. Promotions
        if (promotions.length) {
            const { error: promoErr } = await VendorPromotionService.createBatch(updated.promotions);
            if (promoErr) {
                error.value = 'Promotions creation failed';
                await rollback(stepsDone);
                loading.value = false;
                return { vendorId, success: false, error: error.value };
            }
            stepsDone.push(async () => { await VendorPromotionService.deleteByVendorId(vendorId!); });
        }

        // 6. Rest days
        if (restDays.length) {
            const { error: restErr } = await VendorsRestDaysService.createBatch(updated.restDays);
            if (restErr) {
                error.value = 'Rest days creation failed';
                await rollback(stepsDone);
                loading.value = false;
                return { vendorId, success: false, error: error.value };
            }
            stepsDone.push(async () => { await VendorsRestDaysService.deleteByVendorId(vendorId!); });
        }

        // 7. Portfolio tags
        if (portfolioTags.length) {
            const { error: tagErr } = await VendorsPortfolioTagsService.createBatch(updated.portfolioTags);
            if (tagErr) {
                error.value = 'Portfolio tags creation failed';
                await rollback(stepsDone);
                loading.value = false;
                return { vendorId, success: false, error: error.value };
            }
            stepsDone.push(async () => { await VendorsPortfolioTagsService.deleteByVendorId(vendorId!); });
        }

        loading.value = false;
        return { vendorId, success: true };
    }

    async function rollback(stepsDone: Array<() => Promise<void>>) {
        for (let i = stepsDone.length - 1; i >= 0; i--) {
            try { await stepsDone[i](); } catch { /* ignore rollback errors */ }
        }
    }

    return { setupVendorBusiness, loading, error };
}

function updateVendorIdForAll(
    vendorId: string,
    regions: VendorRegion[],
    packages: VendorPackage[],
    promotions: VendorPromotion[],
    restDays: VendorsRestDay[],
    portfolioTags: VendorsPortfolioTag[]
) {
    return {
        regions: regions.map(({ id, created_at, ...rest }) => ({ ...rest, vendor_id: vendorId })),
        packages: packages.map(({ id, ...rest }) => ({ ...rest, vendor_id: vendorId })),
        promotions: promotions.map(({ id, created_at, ...rest }) => ({ ...rest, vendor_id: vendorId })),
        restDays: restDays.map(({ id, created_at, ...rest }) => ({ ...rest, vendor_id: vendorId })),
        portfolioTags: portfolioTags.map(({ id, ...rest }) => ({ ...rest, vendor_id: vendorId })),
    };
}
