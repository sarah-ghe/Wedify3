import { createRouter, createWebHistory } from "vue-router";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "@/router/routes/dashboard.routes";
import { supabase } from "@/lib/supabase";

const routes = [
  {
    path: "/",
    redirect: "/auth",
  },
  ...authRoutes,
  ...dashboardRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  if (requiresAuth && !user) {
    return next({ path: "/auth" });
  }
  next();
});

export default router;
