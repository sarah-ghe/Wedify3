import { supabase } from '@/lib/supabase';

export interface ServiceType {
    id: string;
    name: string;
}

export class ServiceTypesService {
    static async getAll() {
        const { data, error } = await supabase.from('service_types').select('*');
        return { data, error };
    }

    static async getById(id: string) {
        const { data, error } = await supabase.from('service_types').select('*').eq('id', id).single();
        return { data, error };
    }

    static async getByName(name: string) {
        const { data, error } = await supabase.from('service_types').select('*').eq('name', name).single();
        return { data, error };
    }
}
