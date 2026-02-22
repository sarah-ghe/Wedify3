<template>
  <form @submit.prevent="onSubmit">
    <input v-model="email" type="email" placeholder="Enter your email" required />
    <button type="submit">Send Reset Email</button>
    <div v-if="message">{{ message }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "@/lib/supabase";

const email = ref("");
const message = ref("");
const emit = defineEmits<{ (e: "reset", msg: string): void }>();

async function onSubmit() {
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: window.location.origin + "/reset-password",
  });
  message.value = error ? error.message : "Check your email for the reset link.";
  emit("reset", message.value);
}
</script>
