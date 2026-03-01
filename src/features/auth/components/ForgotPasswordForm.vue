<template>
  <form @submit.prevent="onSubmit" class="forgot-form">
    <div class="form-header">
      <h2>Reset Password</h2>
      <p class="form-header-subtitle">We'll send you a recovery link</p>
    </div>

    <!-- Email Input -->
    <FormField
        :model-value="email"
        @update:model-value="email = $event"
        label="Email"
        type="email"
        placeholder="your@email.com"
        icon="mail"
    />

    <!-- Submit Button -->
    <SubmitButton>Send Reset Email</SubmitButton>

    <!-- Message -->
    <div v-if="message" class="message" :class="{ error: isError }">
      {{ message }}
    </div>

    <!-- Divider -->
    <div class="form-divider">
      <div class="form-divider-line"></div>
      <span class="form-divider-text">or</span>
      <div class="form-divider-line"></div>
    </div>

    <!-- Back to Login -->
    <SwitchButton text="Remember your password?" @click="$emit('back')">
      Sign in
    </SwitchButton>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import FormField from "../../shared/components/FormField.vue";
import SubmitButton from "../../shared/components/SubmitButton.vue";
import SwitchButton from "../../shared/components/SwitchButton.vue";
import { supabase } from "@/lib/supabase";

const email = ref("");
const message = ref("");
const isError = ref(false);

const emit = defineEmits<{
  (e: "reset", msg: string): void;
  (e: "back"): void;
}>();

async function onSubmit() {
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: window.location.origin + "/reset-password",
  });
  isError.value = !!error;
  message.value = error
      ? error.message
      : "Check your email for the reset link.";
  emit("reset", message.value);
}
</script>
