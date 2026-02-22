<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.email" placeholder="Email" required />
    <input
      v-model="form.password"
      type="password"
      placeholder="Password"
      required
    />
    <input v-model="form.username" placeholder="Username" required />
    <select v-model="form.role" required>
      <option value="couple">Couple</option>
      <option value="vendor">Vendor</option>
    </select>
    <button type="submit">Sign Up</button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { SignUpParams } from "@/features/shared/types/types";

const props = defineProps<{ initialParams: SignUpParams }>();
const emit = defineEmits<{ (e: "signup", payload: SignUpParams): void }>();

const form = ref<SignUpParams>({ ...props.initialParams });

function onSubmit() {
  emit("signup", form.value);
}
</script>
