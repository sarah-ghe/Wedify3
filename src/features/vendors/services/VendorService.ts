import { supabase } from '@/lib/supabase';

export interface Vendor {
    id: string;
    user_id: string;
    business_name: string;
    created_at: string;
    service_type_id: string;
    reviews_count?: number;
    description?: string;
    rating?: number;
}

export class VendorService {
    static async getAll() {
        const { data, error } = await supabase.from('vendors').select('*');
        return { data, error };
    }

    static async getById(id: string) {
        const { data, error } = await supabase.from('vendors').select('*').eq('id', id).single();
        return { data, error };
    }

    static async create(vendor: Omit<Vendor, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('vendors').insert([vendor]).select().single();
        return { data, error };
    }

    static async update(id: string, updates: Partial<Omit<Vendor, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('vendors').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: string) {
        const { error } = await supabase.from('vendors').delete().eq('id', id);
        return { error };
    }
}
