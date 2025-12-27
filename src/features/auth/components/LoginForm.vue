<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label for="email">Email:</label>
      <input
          id="email"
          v-model="email"
          type="email"
          required
          autocomplete="username"
      />
    </div>
    <div>
      <label for="password">Password:</label>
      <input
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
      />
    </div>
    <button type="submit">Login</button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const emit = defineEmits<{
  (e: 'login', payload: { email: string; password: string }): void;
}>();

function onSubmit() {
  if (email.value && password.value) {
    emit('login', { email: email.value, password: password.value });
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
}
</style>
