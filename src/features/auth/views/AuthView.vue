<template>
  <div class="login-view">
    <h1>Login</h1>
    <LoginForm @login="handleLogin" />
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '../components/LoginForm.vue';
import { useLogin } from '../composables/useLogin';

function handleLogin(payload: { email: string; password: string }) {
  const { login } = useLogin();
  login(payload.email, payload.password);
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
