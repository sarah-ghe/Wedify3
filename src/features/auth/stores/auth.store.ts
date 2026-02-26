import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const role = ref<string | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchUser() {
        loading.value = true
        error.value = null
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
            error.value = sessionError.message
            loading.value = false
            return
        }
        user.value = session?.user ?? null
        if (user.value) {
            // Fetch user role from your users table
            const { data, error: roleError } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.value.id)
                .single()
            if (!roleError) {
                role.value = data?.role ?? null
            } else {
                error.value = roleError.message
            }
        } else {
            role.value = null
        }
        loading.value = false
    }

    function setUser(newUser: User | null, newRole: string | null) {
        user.value = newUser
        role.value = newRole
    }

    function logout() {
        user.value = null
        role.value = null
        supabase.auth.signOut()
    }

    return {
        user,
        role,
        loading,
        error,
        fetchUser,
        setUser,
        logout,
    }
})
