<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="form-input-wrapper">
      <svg v-if="icon" class="form-input-icon" :width="16" :height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <template v-if="icon === 'mail'">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </template>
        <template v-else-if="icon === 'lock'">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </template>
        <template v-else-if="icon === 'heart'">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </template>
        <template v-else-if="icon === 'store'">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </template>
      </svg>
      <input
          :type="currentType"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          class="form-input"
          :class="[icon ? 'with-icon-left' : '', showToggle && type === 'password' ? 'with-icon-right' : '']"
      />
      <button
          v-if="showToggle && type === 'password'"
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
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

interface Props {
  modelValue: string;
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: "mail" | "lock" | "heart" | "store";
  showToggle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  showToggle: false,
});

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const showPassword = ref(false);

const currentType = computed(() => {
  if (props.type === "password" && showPassword.value) return "text";
  return props.type;
});
</script>
