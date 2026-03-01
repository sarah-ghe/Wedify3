import AuthView from "@/features/auth/views/AuthView.vue";
import ResetPasswordView from "@/features/auth/views/ResetPasswordView.vue";

export default [
  {
    path: "/auth",
    name: "Login",
    component: AuthView,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPasswordView,
  },
];
