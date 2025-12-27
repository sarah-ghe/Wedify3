<template>
  <div>
    <SignUpForm :initialParams="initialParams" @signup="handleSignup" />
    <div v-if="loading">Signing up...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SignUpForm from '../components/SignUpForm.vue';
import {SignUpParams, userRole} from '@/lib/types';
import { useSignup } from '../composables/useSignup';

const initialParams = ref<SignUpParams>({
  email: '',
  password: '',
  username: '',
  role: userRole.COUPLE,
});

const { signup, loading, error } = useSignup();

async function handleSignup(params: SignUpParams) {
  await signup(params);
}
</script>
