<template>
  <div class="login-view">
    <h1>Login</h1>
    <LoginForm @login="handleLogin" />
    <Toast
        :message="toastMsg"
        :type="toastType"
        :visible="showToast"
        @update:visible="showToast = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import LoginForm from '../components/LoginForm.vue';
import { useLogin } from '../services/useLogin';
import { LoginParams } from "@/lib/types";
import Toast from '@/features/shared/components/Toast.vue';

const toastMsg = ref('');
const toastType = ref('info');
const showToast = ref(false);
const { login, authError } = useLogin();

async function handleLogin(payload: LoginParams) {
  await login(payload);
  if (authError.value) {
    toastMsg.value = authError.value;
    toastType.value = 'error';
  } else {
    toastMsg.value = 'Login successful!';
    toastType.value = 'success';
  }
  showToast.value = true;
}
</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}
</style>
