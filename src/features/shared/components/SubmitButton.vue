<template>
  <button
      type="submit"
      :disabled="disabled"
      class="submit-button"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);
</script>

