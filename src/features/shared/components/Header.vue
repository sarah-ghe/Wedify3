<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <h1 class="logo-text">Eternelle</h1>
      </div>
      <nav v-if="showNav" class="header-nav">
        <slot name="nav" />
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    showNav?: boolean;
  }>(),
  {
    showNav: false,
  }
);
</script>

