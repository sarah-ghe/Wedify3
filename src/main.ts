import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Shared Styles
import "@/features/shared/styles/variables.css";
import "@/features/shared/styles/forms.css";

// Feature-specific Styles
import "@/features/auth/styles/auth.css";

createApp(App).use(router).mount("#app");
