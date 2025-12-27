import { supabase } from '@/lib/supabase';

export interface VendorsRestDay {
    id: string;
    vendor_id: string;
    day_of_week: string;
    created_at: string;
}

export class VendorsRestDaysService {
    static async getAll() {
        const { data, error } = await supabase.from('vendors_rest_days').select('*');
        return { data, error };
    }

    static async getById(id: string) {
        const { data, error } = await supabase.from('vendors_rest_days').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase.from('vendors_rest_days').select('*').eq('vendor_id', vendorId);
        return { data, error };
    }

    static async create(restDay: Omit<VendorsRestDay, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('vendors_rest_days').insert([restDay]).select().single();
        return { data, error };
    }

    static async createBatch(restDays: Array<Omit<VendorsRestDay, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('vendors_rest_days').insert(restDays);
        return { data, error };
    }

    static async update(id: string, updates: Partial<Omit<VendorsRestDay, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('vendors_rest_days').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: string) {
        const { error } = await supabase.from('vendors_rest_days').delete().eq('id', id);
        return { error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase.from('vendors_rest_days').delete().eq('vendor_id', vendorId);
        return { error };
    }
}
