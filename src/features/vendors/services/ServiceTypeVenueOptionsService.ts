import { supabase } from '@/lib/supabase';

export interface ServiceTypeVenueOption {
    id: number;
    vendor_id: string;
    max_guests: number;
    decorated: boolean;
    created_at: string;
    min_guests?: number;
    has_parking_space?: boolean;
    parking_slots?: number;
}

export class ServiceTypeVenueOptionsService {
    static async getAll() {
        const { data, error } = await supabase.from('service_type_venue_options').select('*');
        return { data, error };
    }

    static async getById(id: number) {
        const { data, error } = await supabase.from('service_type_venue_options').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase.from('service_type_venue_options').select('*').eq('vendor_id', vendorId);
        return { data, error };
    }

    static async create(option: Omit<ServiceTypeVenueOption, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('service_type_venue_options').insert([option]).select().single();
        return { data, error };
    }

    static async createBatch(options: Array<Omit<ServiceTypeVenueOption, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('service_type_venue_options').insert(options);
        return { data, error };
    }

    static async update(id: number, updates: Partial<Omit<ServiceTypeVenueOption, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('service_type_venue_options').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: number) {
        const { error } = await supabase.from('service_type_venue_options').delete().eq('id', id);
        return { error };
    }

    static async deleteBatch(ids: number[]) {
        const { error } = await supabase.from('service_type_venue_options').delete().in('id', ids);
        return { error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase.from('service_type_venue_options').delete().eq('vendor_id', vendorId);
        return { error };
    }
}
