import { supabase } from '@/lib/supabase';

export interface VendorsPortfolioTag {
    id: string;
    vendor_id: string;
    tagged_vendor_id: string;
    file_id: string;
}

export class VendorsPortfolioTagsService {
    static async getAll() {
        const { data, error } = await supabase.from('vendors_portfolio_tags').select('*');
        return { data, error };
    }

    static async getById(id: string) {
        const { data, error } = await supabase.from('vendors_portfolio_tags').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase.from('vendors_portfolio_tags').select('*').eq('vendor_id', vendorId);
        return { data, error };
    }

    static async getByTaggedVendorId(taggedVendorId: string) {
        const { data, error } = await supabase
            .from('vendors_portfolio_tags')
            .select('*')
            .eq('tagged_vendor_id', taggedVendorId);
        return { data, error };
    }

    static async create(tag: Omit<VendorsPortfolioTag, 'id'>) {
        const { data, error } = await supabase.from('vendors_portfolio_tags').insert([tag]).select().single();
        return { data, error };
    }

    static async createBatch(tags: Array<Omit<VendorsPortfolioTag, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('vendors_portfolio_tags').insert(tags);
        return { data, error };
    }

    static async update(id: string, updates: Partial<Omit<VendorsPortfolioTag, 'id'>>) {
        const { data, error } = await supabase.from('vendors_portfolio_tags').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: string) {
        const { error } = await supabase.from('vendors_portfolio_tags').delete().eq('id', id);
        return { error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase.from('vendors_portfolio_tags').delete().eq('vendor_id', vendorId);
        return { error };
    }
}
