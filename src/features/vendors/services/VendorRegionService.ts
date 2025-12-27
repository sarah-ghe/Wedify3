import { supabase } from '@/lib/supabase';

export interface VendorRegion {
    id: string;
    vendor_id: string;
    region_name: string;
    created_at?: string;
}

export class VendorRegionService {
    static async getAll() {
        const { data, error } = await supabase.from('vendor_regions').select('*');
        return { data, error };
    }

    static async getById(id: string) {
        const { data, error } = await supabase.from('vendor_regions').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase.from('vendor_regions').select('*').eq('vendor_id', vendorId);
        return { data, error };
    }

    static async create(region: Omit<VendorRegion, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('vendor_regions').insert([region]).select().single();
        return { data, error };
    }

    static async createBatch(regions: Array<Omit<VendorRegion, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('vendor_regions').insert(regions);
        return { data, error };
    }

    static async update(id: string, updates: Partial<Omit<VendorRegion, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('vendor_regions').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: string) {
        const { error } = await supabase.from('vendor_regions').delete().eq('id', id);
        return { error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase.from('vendor_regions').delete().eq('vendor_id', vendorId);
        return { error };
    }
}
