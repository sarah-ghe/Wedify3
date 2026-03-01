<template>
  <form @submit.prevent="onSubmit" class="login-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2>Welcome back</h2>
      <p class="form-header-subtitle">Continue planning your beautiful day</p>
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

    <!-- Password Input -->
    <FormField
        :model-value="password"
        @update:model-value="password = $event"
        label="Password"
        type="password"
        placeholder="••••••••"
        icon="lock"
        :show-toggle="true"
    />

    <!-- Forgot Password Link -->
    <div class="form-forgot-link">
      <button type="button" @click="$emit('forgot')">
        Forgot password?
      </button>
    </div>

    <!-- Submit Button -->
    <SubmitButton>Sign In</SubmitButton>

    <!-- Divider -->
    <div class="form-divider">
      <div class="form-divider-line"></div>
      <span class="form-divider-text">or</span>
      <div class="form-divider-line"></div>
    </div>

    <!-- Switch to Signup -->
    <SwitchButton text="Don't have an account?" @click="$emit('switch')">
      Create one
    </SwitchButton>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import FormField from "../../shared/components/FormField.vue";
import SubmitButton from "../../shared/components/SubmitButton.vue";
import SwitchButton from "../../shared/components/SwitchButton.vue";
import type { LoginParams } from "@/features/shared/types/types";

const email = ref("");
const password = ref("");

const emit = defineEmits<{
  (e: "login", payload: LoginParams): void;
  (e: "switch"): void;
  (e: "forgot"): void;
}>();

function onSubmit() {
  if (email.value && password.value) {
    emit("login", { email: email.value, password: password.value });
  }
}
</script>
