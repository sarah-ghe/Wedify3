import { supabase } from '@/lib/supabase';

export interface ServiceTypeSavoryOption {
    id: number;
    vendor_id?: string;
    appetizers: boolean;
    buffet: boolean;
    drinks: boolean;
    pastry: boolean;
    wedding_cake: boolean;
    dinner: boolean;
    other?: boolean;
    created_at: string;
}

export class ServiceTypeSavoryOptionsService {
    static async getAll() {
        const { data, error } = await supabase.from('service_type_savory_options').select('*');
        return { data, error };
    }

    static async getById(id: number) {
        const { data, error } = await supabase.from('service_type_savory_options').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase.from('service_type_savory_options').select('*').eq('vendor_id', vendorId);
        return { data, error };
    }

    static async create(option: Omit<ServiceTypeSavoryOption, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('service_type_savory_options').insert([option]).select().single();
        return { data, error };
    }

    static async createBatch(options: Array<Omit<ServiceTypeSavoryOption, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('service_type_savory_options').insert(options);
        return { data, error };
    }

    static async update(id: number, updates: Partial<Omit<ServiceTypeSavoryOption, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('service_type_savory_options').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: number) {
        const { error } = await supabase.from('service_type_savory_options').delete().eq('id', id);
        return { error };
    }

    static async deleteBatch(ids: number[]) {
        const { error } = await supabase.from('service_type_savory_options').delete().in('id', ids);
        return { error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase.from('service_type_savory_options').delete().eq('vendor_id', vendorId);
        return { error };
    }
}
