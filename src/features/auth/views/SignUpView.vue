<template>
  <div>
    <SignUpForm :initialParams="initialParams" @signup="handleSignup" />
    <div v-if="loading">Signing up...</div>
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
import SignUpForm from "../components/SignUpForm.vue";
import Toast from "@/features/shared/components/Toast.vue";
import { SignUpParams, userRole } from "@/features/shared/types/types";
import { useSignup } from "../services/useSignup";
import { useRouter } from "vue-router";

const initialParams = ref<SignUpParams>({
  phoneNumber: "",
  email: "",
  password: "",
  username: "",
  role: userRole.COUPLE,
});

const { signup, loading, error } = useSignup();

const toastMsg = ref("");
const toastType = ref("info");
const showToast = ref(false);
const router = useRouter();

async function handleSignup(params: SignUpParams) {
  const data = await signup(params);
  if (error.value) {
    toastMsg.value = error.value;
    toastType.value = "error";
  } else {
    toastMsg.value = "Signup successful!";
    toastType.value = "success";
  }
  showToast.value = true;
  if (data?.user?.id) {
    await router.replace(`/dashboard/${data.user.id}`);
  }
}
</script>
