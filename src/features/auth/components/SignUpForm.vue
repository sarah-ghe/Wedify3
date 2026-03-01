<template>
  <form @submit.prevent="onSubmit" class="signup-form">
    <!-- Form Header -->
    <div class="form-header">
      <h2>Begin your journey</h2>
      <p class="form-header-subtitle">Join thousands planning their perfect wedding</p>
    </div>

    <!-- Role Selector -->
    <RoleSelector
      v-model="form.role"
      @update:modelValue="$emit('role-change', $event)"
    />

    <!-- Name Input -->
    <FormField
        :model-value="form.username"
        @update:model-value="form.username = $event"
        :label="form.role === userRole.COUPLE ? 'Your Names' : 'Business Name'"
        :placeholder="form.role === userRole.COUPLE ? 'Alex & Jordan' : 'Your Business Name'"
        :icon="form.role === userRole.COUPLE ? 'heart' : 'store'"
    />

    <!-- Email Input -->
    <FormField
        :model-value="form.email"
        @update:model-value="form.email = $event"
        label="Email"
        type="email"
        placeholder="your@email.com"
        icon="mail"
    />

    <!-- Password Input -->
    <FormField
        :model-value="form.password"
        @update:model-value="form.password = $event"
        label="Password"
        type="password"
        placeholder="••••••••"
        icon="lock"
        :show-toggle="true"
    />

    <!-- Submit Button -->
    <SubmitButton>
      {{ form.role === userRole.COUPLE ? 'Start Planning Together ✦' : 'List Your Services ✦' }}
    </SubmitButton>

    <!-- Terms -->
    <p class="form-terms">
      By signing up you agree to our
      <span class="text-link">Terms</span> &
      <span class="text-link">Privacy Policy</span>
    </p>

    <!-- Divider -->
    <div class="form-divider">
      <div class="form-divider-line"></div>
      <span class="form-divider-text">or</span>
      <div class="form-divider-line"></div>
    </div>

    <!-- Switch to Login -->
    <SwitchButton text="Already have an account?" @click="$emit('switch')">
      Sign in
    </SwitchButton>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import FormField from "../../shared/components/FormField.vue";
import RoleSelector from "./RoleSelector.vue";
import SubmitButton from "../../shared/components/SubmitButton.vue";
import SwitchButton from "../../shared/components/SwitchButton.vue";
import type { SignUpParams } from "@/features/shared/types/types";
import { userRole } from "@/features/shared/types/types";

const props = defineProps<{ initialParams: SignUpParams }>();
const emit = defineEmits<{
  (e: "signup", payload: SignUpParams): void;
  (e: "switch"): void;
  (e: "role-change", role: string): void;
}>();

const form = ref<SignUpParams>({ ...props.initialParams });

function onSubmit() {
  emit("signup", form.value);
}
</script>
