import { supabase } from '@/lib/supabase';

export interface VendorPromotion {
    id: number;
    vendor_id: string;
    name: string;
    price: number;
    discount_price: number;
    start_date: string;
    end_date: string;
    status: string;
    description?: string;
    package_id?: string;
    benefits?: any;
    created_at: string;
    features?: any;
}

export class VendorPromotionService {
    static async getAll() {
        const { data, error } = await supabase.from('vendor_promotions').select('*');
        return { data, error };
    }

    static async getById(id: number) {
        const { data, error } = await supabase.from('vendor_promotions').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase.from('vendor_promotions').select('*').eq('vendor_id', vendorId);
        return { data, error };
    }

    static async create(promotion: Omit<VendorPromotion, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('vendor_promotions').insert([promotion]).select().single();
        return { data, error };
    }

    static async createBatch(promotions: Array<Omit<VendorPromotion, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('vendor_promotions').insert(promotions);
        return { data, error };
    }

    static async update(id: number, updates: Partial<Omit<VendorPromotion, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('vendor_promotions').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: number) {
        const { error } = await supabase.from('vendor_promotions').delete().eq('id', id);
        return { error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase.from('vendor_promotions').delete().eq('vendor_id', vendorId);
        return { error };
    }
}
