import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { LoginParams } from '@/lib/types';

export function useLogin() {
    const loading = ref(false);
    const authError = ref<string | null>(null);

    async function login(payload: LoginParams) {
        const email = payload.email
        const password = payload.password

        loading.value = true;
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            authError.value = error.message;
            console.error('Login failed:', error.message, error);
        } else {
            authError.value = null;
            console.log('Login successful:', data);
        }
        loading.value = false;
    }

    return { login, loading, authError };
}
