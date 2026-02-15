<template>
  <div v-if="visible" :class="['toast', type]">
    <span class="toast-message">{{ message }}</span>
    <button class="toast-close" @click="close" aria-label="Close">&times;</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'Toast',
  props: {
    message: { type: String, required: true },
    type: { type: String, default: 'info' },
    visible: { type: Boolean, default: false },
    duration: { type: Number, default: 3000 }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const timer = ref<number | null>(null);

    function close() {
      emit('update:visible', false);
      if (timer.value) clearTimeout(timer.value);
    }

    watch(() => props.visible, (val) => {
      if (val && props.duration > 0) {
        timer.value = window.setTimeout(() => {
          emit('update:visible', false);
        }, props.duration);
      }
    });

    return { close };
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  min-width: 240px;
  max-width: 360px;
  padding: 18px 24px;
  border-radius: 16px;
  color: #fff;
  font-size: 16px;
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 1.5px 3px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  animation: toast-fade-in 0.25s;
}
.toast-message {
  flex: 1;
}
.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 22px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  border-radius: 50%;
  transition: background 0.2s;
}
.toast-close:hover {
  background: rgba(255,255,255,0.12);
}
.toast.info { background: #2196f3; }
.toast.success { background: #28a745; }
.toast.error { background: #dc3545; }

@keyframes toast-fade-in {
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>
