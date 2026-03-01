<template>
  <h1>Vendor Dashboard</h1>
  <p>User ID: {{ userId }}</p>
  <button @click="handleLogout">Logout</button>
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";

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
