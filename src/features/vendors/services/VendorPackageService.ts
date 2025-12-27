import { supabase } from '@/lib/supabase';

export interface VendorPackage {
    id: string;
    vendor_id: string;
    name: string;
    price: number;
    features: any;
    is_daily_booking: boolean;
    description?: string;
    hour_range?: number;
    has_multi_booking?: boolean;
    is_promo?: boolean;
}

export class VendorPackageService {
    static async getAll() {
        const { data, error } = await supabase.from('vendor_packages').select('*');
        return { data, error };
    }

    static async getById(id: string) {
        const { data, error } = await supabase.from('vendor_packages').select('*').eq('id', id).single();
        return { data, error };
    }

    static async create(pkg: Omit<VendorPackage, 'id'>) {
        const { data, error } = await supabase.from('vendor_packages').insert([pkg]).select().single();
        return { data, error };
    }

    static async createBatch(pkgs: Array<Omit<VendorPackage, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('vendor_packages').insert(pkgs);
        return { data, error };
    }

    static async update(id: string, updates: Partial<Omit<VendorPackage, 'id'>>) {
        const { data, error } = await supabase.from('vendor_packages').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: string) {
        const { error } = await supabase.from('vendor_packages').delete().eq('id', id);
        return { error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase
            .from('vendor_packages')
            .select('*')
            .eq('vendor_id', vendorId);
        return { data, error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase
            .from('vendor_packages')
            .delete()
            .eq('vendor_id', vendorId);
        return { error };
    }
}
