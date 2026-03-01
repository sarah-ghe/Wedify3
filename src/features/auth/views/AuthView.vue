<template>
  <div class="auth-container">
    <!-- Toast Notifications -->
    <Toast
        :visible.sync="showToast"
        :message="toastMessage"
        :type="toastType"
        :duration="4000"
        @update:visible="showToast = $event"
    />

    <!-- Left Panel — Modern Decorative Design -->
    <DecorativePanel
      brand-name="Eternelle"
      :active-role="currentMode === 'signup' ? initialParams.role : 'couple'"
      :current-mode="currentMode"
    />

    <!-- Right Panel — form -->
    <div class="form-panel">
      <!-- Mobile logo -->
      <div class="mobile-logo">
        <div class="logo-symbol">✦</div>
        <h1>Eternelle</h1>
        <div class="logo-divider"></div>
      </div>

      <div class="form-container">
        <!-- Forgot Password Modal -->
        <div v-if="showForgotModal" class="modal-overlay" @click.self="showForgotModal = false">
          <div class="modal-content">
            <button class="modal-close" @click="showForgotModal = false">✕</button>
            <ForgotPasswordForm
                @reset="handleForgotReset"
                @back="showForgotModal = false"
            />
          </div>
        </div>

        <!-- Tab switcher -->
        <div class="tab-switcher">
          <button
              v-for="tab in authModes"
              :key="tab"
              @click="currentMode = tab"
              :class="{ active: currentMode === tab }"
              class="tab-button"
          >
            {{ tab === 'login' ? 'Sign In' : 'Create Account' }}
          </button>
        </div>

        <!-- Forms -->
        <LoginForm
            v-if="currentMode === 'login'"
            @login="handleLogin"
            @switch="() => (currentMode = 'signup')"
            @forgot="showForgotModal = true"
        />
        <SignUpForm
            v-else
            :initialParams="initialParams"
            @signup="handleSignup"
            @switch="() => (currentMode = 'login')"
            @role-change="handleRoleChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Toast from "@/features/shared/components/Toast.vue";
import DecorativePanel from "../components/DecorativePanel.vue";
import LoginForm from "../components/LoginForm.vue";
import SignUpForm from "../components/SignUpForm.vue";
import ForgotPasswordForm from "../components/ForgotPasswordForm.vue";
import { useRouter } from "vue-router";
import { useLogin } from "../services/useLogin";
import { useSignup } from "../services/useSignup";
import type { LoginParams, SignUpParams } from "@/features/shared/types/types";
import { userRole } from "@/features/shared/types/types";

const router = useRouter();
const { login, authError } = useLogin();
const { signup, error } = useSignup();

const authModes: ("login" | "signup")[] = ["login", "signup"];
const currentMode = ref<"login" | "signup">("login");
const showForgotModal = ref(false);

// Toast state
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref<"success" | "error" | "info">("info");

const initialParams = ref<SignUpParams>({
  email: "",
  username: "",
  password: "",
  role: userRole.COUPLE,
  phoneNumber: "",
});

function displayToast(message: string, type: "success" | "error" | "info" = "info") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
}

function handleRoleChange(role: string) {
  initialParams.value.role = role as typeof userRole.COUPLE | typeof userRole.VENDOR;
}

async function handleLogin(payload: LoginParams) {
  try {
    await login(payload);
    if (!authError.value) {
      displayToast("Welcome back! Redirecting to dashboard...", "success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      displayToast("Login failed. Please check your credentials.", "error");
    }
  } catch (err) {
    displayToast("An error occurred during login. Please try again.", "error");
  }
}

async function handleSignup(params: SignUpParams) {
  try {
    const data = await signup(params);
    if (!error.value && data?.user?.id) {
      displayToast("Account created successfully! Redirecting...", "success");
      setTimeout(() => {
        router.push(`/dashboard/${data.user?.id}`);
      }, 1500);
    } else {
      displayToast("Signup failed. Please try again.", "error");
    }
  } catch (err) {
    displayToast("An error occurred during signup. Please try again.", "error");
  }
}

function handleForgotReset(message: string) {
  if (message.includes("email")) {
    displayToast(message, "success");
  } else {
    displayToast(message, "error");
  }
  setTimeout(() => {
    showForgotModal.value = false;
  }, 2000);
}
</script>
