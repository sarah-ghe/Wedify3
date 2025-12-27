import { supabase } from '@/lib/supabase';

export interface ServiceTypeMusicOptionDz {
    id: number;
    vendor_id: string;
    malouf: boolean;
    gasba: boolean;
    fkairat: boolean;
    band: boolean;
    dj: boolean;
    solo_artist: boolean;
    other?: boolean;
    created_at: string;
}

export class ServiceTypeMusicOptionsDzService {
    static async getAll() {
        const { data, error } = await supabase.from('service_type_music_options_dz').select('*');
        return { data, error };
    }

    static async getById(id: number) {
        const { data, error } = await supabase.from('service_type_music_options_dz').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByVendorId(vendorId: string) {
        const { data, error } = await supabase.from('service_type_music_options_dz').select('*').eq('vendor_id', vendorId);
        return { data, error };
    }

    static async create(option: Omit<ServiceTypeMusicOptionDz, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('service_type_music_options_dz').insert([option]).select().single();
        return { data, error };
    }

    static async createBatch(options: Array<Omit<ServiceTypeMusicOptionDz, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('service_type_music_options_dz').insert(options);
        return { data, error };
    }

    static async update(id: number, updates: Partial<Omit<ServiceTypeMusicOptionDz, 'id' | 'created_at'>>) {
        const { data, error } = await supabase.from('service_type_music_options_dz').update(updates).eq('id', id).select().single();
        return { data, error };
    }

    static async delete(id: number) {
        const { error } = await supabase.from('service_type_music_options_dz').delete().eq('id', id);
        return { error };
    }

    static async deleteBatch(ids: number[]) {
        const { error } = await supabase.from('service_type_music_options_dz').delete().in('id', ids);
        return { error };
    }

    static async deleteByVendorId(vendorId: string) {
        const { error } = await supabase.from('service_type_music_options_dz').delete().eq('vendor_id', vendorId);
        return { error };
    }
}
