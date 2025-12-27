import { supabase } from '@/lib/supabase';

export interface ServiceTypeOrganizerOption {
    id: number;
    vendor_id: string;
    no_camera: boolean;
    organizer: boolean;
    caffe_service: boolean;
    created_at: string;
}

export class ServiceTypeOrganizerOptionsService {
    static async getAll() {
        const { data, error } = await supabase.from('service_type_organizer_options').select('*');
        return { data, error };
    }

    static async getById(id: number) {
        const { data, error } = await supabase.from('service_type_organizer_options').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase.from('service_type_organizer_options').select('*').eq('vendor_id', vendorId);
        return { data, error };
    }

    static async create(option: Omit<ServiceTypeOrganizerOption, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('service_type_organizer_options').insert([option]).select().single();
        return { data, error };
    }

    static async createBatch(options: Array<Omit<ServiceTypeOrganizerOption, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('service_type_organizer_options').insert(options);
        return { data, error };
    }

    static async update(id: number, updates: Partial<Omit<ServiceTypeOrganizerOption, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('service_type_organizer_options').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: number) {
        const { error } = await supabase.from('service_type_organizer_options').delete().eq('id', id);
        return { error };
    }

    static async deleteBatch(ids: number[]) {
        const { error } = await supabase.from('service_type_organizer_options').delete().in('id', ids);
        return { error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase.from('service_type_organizer_options').delete().eq('vendor_id', vendorId);
        return { error };
    }
}
