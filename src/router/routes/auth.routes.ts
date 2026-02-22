import AuthView from "@/features/auth/views/AuthView.vue";
import SignUpView from "@/features/auth/views/SignUpView.vue";
import ResetPasswordView from "@/features/auth/views/ResetPasswordView.vue";

export default [
  {
    path: "/login",
    name: "Login",
    component: AuthView,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUpView,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPasswordView,
  },
];
