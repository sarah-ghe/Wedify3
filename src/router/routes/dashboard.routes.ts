import DashboardWrapper from "@/features/dashboard/views/DashboardWrapper.vue";

export default [
  {
    path: "/dashboard/:userId",
    name: "Dashboard",
    component: DashboardWrapper,
    meta: { requiresAuth: true },
  },
];
