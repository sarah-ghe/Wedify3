<template>
  <div class="reset-container">
    <div class="reset-form-wrapper">
      <div class="form-header">
        <h2>Reset Password</h2>
        <p class="form-header-subtitle">Enter your new password</p>
      </div>
      <form @submit.prevent="onSubmit" class="reset-form">
        <div class="form-group">
          <label class="form-label">New Password</label>
          <div class="form-input-wrapper">
            <svg class="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              class="form-input with-icon-left with-icon-right"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="form-input-icon right"
            >
              <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-4-11-4s1.6-3.2 4.6-5.4"></path>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 4 11 4s-1.6 3.2-4.6 5.4"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>
        <button type="submit" class="submit-button">Update Password</button>
        <div v-if="message" class="message" :class="{ error: isError }">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";

const password = ref("");
const message = ref("");
const isError = ref(false);
const showPassword = ref(false);
const router = useRouter();

async function onSubmit() {
  const { error } = await supabase.auth.updateUser({
    password: password.value,
  });
  if (error) {
    message.value = error.message;
    isError.value = true;
  } else {
    message.value = "Password updated! Redirecting to login...";
    isError.value = false;
    setTimeout(() => router.replace("/auth"), 2000);
  }
}
</script>
