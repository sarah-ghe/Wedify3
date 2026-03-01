<template>
  <transition name="toast-fade">
    <div v-if="visible" :class="['toast', `toast-${type}`]">
      <div class="toast-icon">
        <svg v-if="type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <svg v-else-if="type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <div class="toast-content">
        <p class="toast-message">{{ message }}</p>
      </div>
      <button class="toast-close" @click="close" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

interface Props {
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: "info",
  duration: 4000,
});

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const timer = ref<number | null>(null);

function close() {
  emit("update:visible", false);
  if (timer.value) clearTimeout(timer.value);
}

watch(
  () => props.visible,
  (val) => {
    if (timer.value) clearTimeout(timer.value);
    if (val && props.duration > 0) {
      timer.value = window.setTimeout(() => {
        emit("update:visible", false);
      }, props.duration);
    }
  }
);
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  min-width: 280px;
  max-width: 400px;
  padding: var(--spacing-lg);
  border-radius: var(--radius-sm);
  color: white;
  font-size: 0.95rem;
  font-family: var(--font-serif);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toast-message {
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--transition-normal);
  opacity: 0.8;
}

.toast-close:hover {
  opacity: 1;
}

/* Toast Types */
.toast-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.toast-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.toast-info {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

/* Animations */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all var(--transition-normal);
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) translateX(20px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) translateX(20px);
}

@media (max-width: 640px) {
  .toast {
    bottom: var(--spacing-lg);
    right: var(--spacing-lg);
    left: var(--spacing-lg);
    min-width: auto;
  }
}
</style>
