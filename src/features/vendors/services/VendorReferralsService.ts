import { supabase } from '@/lib/supabase';

export interface VendorReferral {
    id: string;
    from_vendor_id: string;
    to_vendor_id: string;
    booking_id: string;
    note?: string;
    created_at?: string;
}

export class VendorReferralsService {
    static async getAll() {
        const { data, error } = await supabase.from('vendor_referrals').select('*');
        return { data, error };
    }

    static async getById(id: string) {
        const { data, error } = await supabase.from('vendor_referrals').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByFromVendorId(fromVendorId: string) {
        const { data, error } = await supabase.from('vendor_referrals').select('*').eq('from_vendor_id', fromVendorId);
        return { data, error };
    }

    static async getByToVendorId(toVendorId: string) {
        const { data, error } = await supabase.from('vendor_referrals').select('*').eq('to_vendor_id', toVendorId);
        return { data, error };
    }

    static async create(entry: Omit<VendorReferral, 'id'>) {
        const { data, error } = await supabase.from('vendor_referrals').insert([entry]).select().single();
        return { data, error };
    }

    static async createBatch(entries: Array<Omit<VendorReferral, 'id'>>) {
        const { data, error } = await supabase.from('vendor_referrals').insert(entries);
        return { data, error };
    }

    static async update(id: string, updates: Partial<Omit<VendorReferral, 'id'>>) {
        const { data, error } = await supabase.from('vendor_referrals').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: string) {
        const { error } = await supabase.from('vendor_referrals').delete().eq('id', id);
        return { error };
    }

    static async deleteBatch(ids: string[]) {
        const { error } = await supabase.from('vendor_referrals').delete().in('id', ids);
        return { error };
    }

    static async deleteByFromVendorId(fromVendorId: string) {
        const { error } = await supabase.from('vendor_referrals').delete().eq('from_vendor_id', fromVendorId);
        return { error };
    }

    static async deleteByToVendorId(toVendorId: string) {
        const { error } = await supabase.from('vendor_referrals').delete().eq('to_vendor_id', toVendorId);
        return { error };
    }
}
