<template>
  <form @submit.prevent="onSubmit">
    <input v-model="password" type="password" placeholder="New password" required />
    <button type="submit">Update Password</button>
    <div v-if="message">{{ message }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";

const password = ref("");
const message = ref("");
const router = useRouter();

async function onSubmit() {
  const { error } = await supabase.auth.updateUser({ password: password.value });
  if (error) {
    message.value = error.message;
  } else {
    message.value = "Password updated! Redirecting to login...";
    setTimeout(() => router.replace("/login"), 2000);
  }
}
</script>
