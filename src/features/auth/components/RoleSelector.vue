<template>
  <div class="role-selector">
    <button
        type="button"
        @click="$emit('update:modelValue', userRole.COUPLE)"
        :class="['role-button', { active: modelValue === userRole.COUPLE }]"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span>We're a Couple</span>
    </button>
    <button
        type="button"
        @click="$emit('update:modelValue', userRole.VENDOR)"
        :class="['role-button', { active: modelValue === userRole.VENDOR }]"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <span>I'm a Vendor</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { userRole } from "@/features/shared/types/types";

defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
