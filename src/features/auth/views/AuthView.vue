<template>
  <div class="login-view">
    <h1>Login</h1>
    <LoginForm @login="handleLogin" />
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '../components/LoginForm.vue';
import { useLogin } from '../composables/useLogin';
import { LoginParams } from "@/lib/types";

function handleLogin(payload: LoginParams) {
  const { login } = useLogin();
  login(payload);
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
