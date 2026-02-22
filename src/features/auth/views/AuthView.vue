<template>
  <div class="login-view">
    <h1>Login</h1>
    <LoginForm @login="handleLogin" />
    <button class="forgot-btn" @click="showForgot = !showForgot">
      Forgot Password?
    </button>
    <ForgotPasswordForm v-if="showForgot" @reset="onReset" />
    <Toast
        :message="toastMsg"
        :type="toastType"
        :visible="showToast"
        @update:visible="showToast = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import LoginForm from "../components/LoginForm.vue";
import ForgotPasswordForm from "../components/ForgotPasswordForm.vue";
import { useLogin } from "../services/useLogin";
import { LoginParams } from "@/features/shared/types/types";
import Toast from "@/features/shared/components/Toast.vue";
import { useRouter } from "vue-router";

const toastMsg = ref("");
const toastType = ref("info");
const showToast = ref(false);
const showForgot = ref(false);
const { login, authError } = useLogin();
const router = useRouter();

async function handleLogin(payload: LoginParams) {
  const { data, error } = await login(payload);
  if (error || authError.value) {
    toastMsg.value = error?.message || authError.value || "Login failed.";
    toastType.value = "error";
  } else {
    toastMsg.value = "Login successful!";
    toastType.value = "success";
  }
  showToast.value = true;
  if (data?.user?.id) {
    await router.replace(`/dashboard/${data.user.id}`);
  }
}

function onReset(message: string) {
  toastMsg.value = message;
  toastType.value = "info";
  showToast.value = true;
  showForgot.value = false;
}
</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}
.forgot-btn {
  margin-top: 1rem;
  background: none;
  border: none;
  color: #6c2eb7;
  cursor: pointer;
  text-decoration: underline;
}
</style>
