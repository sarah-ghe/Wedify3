<template>
  <div class="switch-mode">
    <span>{{ text }}</span>
    <button type="button" @click="$emit('click')" class="switch-button">
      <slot></slot>
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  text: string;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>

