<template>
  <h1>Couple Dashboard</h1>
  <p>User ID: {{ userId }}</p>
  <button @click="handleLogout">Logout</button>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";

const router = useRouter();
defineProps<{ userId: string }>();
async function handleLogout() {
  await supabase.auth.signOut();
  await router.replace("/auth");
}
</script>

<style scoped>
h1 {
  margin-top: 2rem;
  text-align: center;
}
</style>
