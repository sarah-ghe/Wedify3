import { supabase } from '@/lib/supabase';

export interface VendorUnavailableDate {
    id: string;
    vendor_id: string;
    date: string;
    reason?: string;
}

export class VendorUnavailableDatesService {
    static async getAll() {
        const { data, error } = await supabase.from('vendor_unavailable_dates').select('*');
        return { data, error };
    }

    static async getById(id: string) {
        const { data, error } = await supabase.from('vendor_unavailable_dates').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase.from('vendor_unavailable_dates').select('*').eq('vendor_id', vendorId);
        return { data, error };
    }

    static async create(entry: Omit<VendorUnavailableDate, 'id'>) {
        const { data, error } = await supabase.from('vendor_unavailable_dates').insert([entry]).select().single();
        return { data, error };
    }

    static async createBatch(entries: Array<Omit<VendorUnavailableDate, 'id'>>) {
        const { data, error } = await supabase.from('vendor_unavailable_dates').insert(entries);
        return { data, error };
    }

    static async update(id: string, updates: Partial<Omit<VendorUnavailableDate, 'id'>>) {
        const { data, error } = await supabase.from('vendor_unavailable_dates').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: string) {
        const { error } = await supabase.from('vendor_unavailable_dates').delete().eq('id', id);
        return { error };
    }

    static async deleteBatch(ids: string[]) {
        const { error } = await supabase.from('vendor_unavailable_dates').delete().in('id', ids);
        return { error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase.from('vendor_unavailable_dates').delete().eq('vendor_id', vendorId);
        return { error };
    }
}
