<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";
import VendorDashboard from "./VendorDashboard.vue";
import CoupleDashboard from "./CoupleDashboard.vue";

const route = useRoute();
const router = useRouter();
const userRole = ref<string | null>(null);
const userId = ref<string | null>(null);

onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  userId.value = session?.user?.id || null;
  console.log("session:", session);
  console.log("userId:", userId.value);
  console.log("Route param userId:", route.params.userId);

  if (!session || session.user.id !== route.params.userId) {
    await router.replace("/login");
    return;
  }

  // Fetch role from users table
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !data?.role) {
    console.log("Role not found or error:", error);
    await router.replace("/login");
    return;
  }

  userRole.value = data.role;
  console.log("userRole:", userRole.value);
});
</script>

<template>
  <component
    :is="
      userRole === 'vendor'
        ? VendorDashboard
        : userRole === 'couple'
          ? CoupleDashboard
          : null
    "
    v-if="userRole && userId"
    :userId="userId"
  />
</template>
