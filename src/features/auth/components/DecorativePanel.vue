<template>
  <div class="decorative-panel" :class="autoRole">
    <!-- Background gradient overlay -->
    <div class="panel-background"></div>

    <!-- Subtle decorative rings -->
    <div class="ring ring-1"></div>
    <div class="ring ring-2"></div>

    <!-- Top brand section -->
    <div class="brand-section">
      <div class="brand-sigil">✦</div>
      <h2 class="brand-title">{{ brandName }}</h2>
      <div class="brand-divider"></div>
    </div>

    <!-- Content area with smooth transitions -->
    <Transition name="content-fade" mode="out-in">
      <div :key="autoRole" class="panel-content">
        <!-- Dynamic header based on role -->
        <div class="content-header">
          <p class="content-eyebrow">{{ autoRole === 'couple' ? 'For the ones saying yes' : 'For the makers of magic' }}</p>
          <h3 class="content-headline" v-if="autoRole === 'couple'">
            Plan Your<br /><em>Perfect Day</em>
          </h3>
          <h3 class="content-headline" v-else>
            Grow Your<br /><em>Business</em>
          </h3>
        </div>

        <div class="divider-line"></div>

        <!-- Dynamic Features list -->
        <div class="features-list">
          <div
            v-for="(feature, i) in currentFeatures"
            :key="feature.label"
            class="feature-item"
            :style="{ animationDelay: `${i * 50}ms` }"
          >
            <div class="feature-text">
              <strong>{{ feature.label }}</strong>
              <span>{{ feature.desc }}</span>
            </div>
          </div>
        </div>

        <!-- Dynamic Stats section -->
        <div class="stats-row">
          <div class="stat-item" v-for="stat in currentStats" :key="stat.value">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating decorative elements -->
    <div class="floating-elements">
      <div v-for="n in 3" :key="n" :class="`float-element element-${n}`"></div>
    </div>

    <!-- Animated accent lines -->
    <div class="accent-lines">
      <div class="accent-line line-1"></div>
      <div class="accent-line line-2"></div>
      <div class="accent-line line-3"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";

interface Props {
  brandName?: string;
  activeRole?: "couple" | "vendor";
  currentMode?: "login" | "signup";
}

const props = withDefaults(defineProps<Props>(), {
  brandName: "Eternelle",
  activeRole: "couple",
  currentMode: "login",
});

const autoRole = ref<"couple" | "vendor">(props.activeRole);
const timeoutId = ref<number | null>(null);
const AUTO_SWITCH_DELAY = 16000; // 16 seconds

// ...existing code...

// Auto-switch between roles (only on login form)
function startAutoSwitch() {
  // Only auto-switch when on login form
  if (props.currentMode !== "login") {
    clearTimeout();
    return;
  }

  clearTimeout();
  timeoutId.value = window.setTimeout(() => {
    autoRole.value = autoRole.value === "couple" ? "vendor" : "couple";
    startAutoSwitch(); // Restart the timeout for continuous cycling
  }, AUTO_SWITCH_DELAY);
}

// Reset timeout when activeRole changes (user selected a role on signup form)
watch(
  () => props.activeRole,
  (newRole) => {
    autoRole.value = newRole;
    // Only start auto-switch if on login form
    if (props.currentMode === "login") {
      startAutoSwitch();
    } else {
      clearTimeout(); // Stop auto-switch on signup form
    }
  }
);

// Watch for form mode changes
watch(
  () => props.currentMode,
  (newMode) => {
    if (newMode === "login") {
      // Start auto-switch when entering login form
      startAutoSwitch();
    } else {
      // Stop auto-switch when entering signup form
      clearTimeout();
      // Show the selected role
      autoRole.value = props.activeRole;
    }
  }
);

function clearTimeout() {
  if (timeoutId.value !== null) {
    window.clearTimeout(timeoutId.value);
    timeoutId.value = null;
  }
}

onMounted(() => {
  // Only start auto-switch if on login form
  if (props.currentMode === "login") {
    startAutoSwitch();
  }
});

onUnmounted(() => {
  clearTimeout();
});

const coupleFeatures = [
  {
    label: "Personalized Vendor Matching",
    desc: "AI-curated recommendations tailored to Algerian culture, budget, and wedding vision — no endless searching."
  },
  {
    label: "Automated Wedding Roadmap",
    desc: "A dynamic task plan generated from your profile, guiding you step-by-step from engagement to wedding day."
  },
  {
    label: "Instant Booking & Smart Waitlists",
    desc: "Check availability in real time, book instantly, or join a priority waitlist to secure canceled slots automatically."
  },
  {
    label: "Unified Wedding Dashboard",
    desc: "Track bookings, payments, deadlines, tasks, and conversations in one powerful control center."
  },
  {
    label: "Budget Intelligence",
    desc: "Monitor spending, payment due dates, and vendor costs with smart insights that protect your wedding budget."
  },
  {
    label: "Seamless Social-to-App Experience",
    desc: "Start from Instagram or WhatsApp, let the bot create your wedding profile automatically, and continue inside the app without losing progress."
  },
  {
    label: "Verified Reviews & Top Vendors",
    desc: "Explore trusted vendors ranked by real reviews and performance — choose with confidence."
  }
];

const vendorFeatures = [
  {
    label: "Instant Lead Generation",
    desc: "Get notified the moment a couple matching your services joins the platform — contact them before competitors."
  },
  {
    label: "AI Social Media Booking Bots",
    desc: "Convert Instagram and WhatsApp traffic automatically with bots that answer availability and send booking requests 24/7."
  },
  {
    label: "Advanced Booking Management",
    desc: "Manage leads, bookings, payments, and appointments from one intelligent dashboard."
  },
  {
    label: "Zero-Empty-Slot Protection",
    desc: "Smart waitlists instantly refill canceled bookings so you never lose revenue."
  },
  {
    label: "Marketplace Hotspots",
    desc: "Secure limited weekly top placements and dominate visibility in your category."
  },
  {
    label: "Portfolio & Promotions Engine",
    desc: "Showcase premium portfolios, promote packages, and highlight limited-time offers."
  },
  {
    label: "Collaboration & Vendor Tagging",
    desc: "Partner with other vendors, recommend services in chat, and grow together."
  },
  {
    label: "Multi-Business Management",
    desc: "Operate multiple wedding brands under one master dashboard with full performance visibility."
  }
];

const coupleStats = [
  { value: "500+", label: "Vendors" },
  { value: "4 Cities", label: "Coverage" },
  { value: "Free", label: "To Join" },
];

const vendorStats = [
  { value: "3x", label: "More Leads" },
  { value: "24/7", label: "Bot Active" },
  { value: "Free", label: "To List" },
];

const currentFeatures = computed(() =>
  autoRole.value === "couple" ? coupleFeatures : vendorFeatures
);

const currentStats = computed(() =>
  autoRole.value === "couple" ? coupleStats : vendorStats
);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap");

/* ── PANEL BASE ─────────────────────────────────────────────── */
.decorative-panel {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: none;
  flex-direction: column;
  padding: 3rem 2.5rem;
  font-family: "DM Sans", sans-serif;
  background: linear-gradient(135deg, #f9e8e0 0%, #fdf3ee 40%, #faf0e6 70%, #f5e6d3 100%);
  transition: all 0.6s ease;
}

@media (min-width: 1024px) {
  .decorative-panel {
    display: flex;
    width: 50%;
    align-items: center;
    justify-content: center;
  }
}

/* ── BACKGROUND ────────────────────────────────────────────── */
.panel-background {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
}

/* ── DECORATIVE RINGS ───────────────────────────────────────── */
.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  pointer-events: none;
  z-index: 1;
  animation: subtle-rotate 60s linear infinite;
}

.ring-1 {
  width: 320px;
  height: 320px;
  top: -160px;
  left: -150px;
  border-color: rgba(201, 169, 110, 0.08);
  animation-duration: 80s;
}

.ring-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -80px;
  border-color: rgba(201, 169, 110, 0.06);
  animation-duration: 120s;
  animation-direction: reverse;
}

@keyframes subtle-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── BRAND SECTION ──────────────────────────────────────────── */
.brand-section {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fade-in 0.8s ease;
}

.brand-sigil {
  font-size: 1.2rem;
  color: #c9a96e;
  opacity: 0.9;
  display: block;
  margin-bottom: 0.5rem;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.brand-title {
  font-family: "Cormorant Garamond", serif;
  font-size: 2.2rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: #3f2817;
  margin: 0;
  text-transform: uppercase;
}

.brand-divider {
  width: 3rem;
  height: 1px;
  background-color: #fbbf24;
  margin: 1rem auto;
  opacity: 0.7;
  animation: expand 1s ease 0.3s backwards;
}

@keyframes expand {
  from { width: 0; opacity: 0; }
  to { width: 3rem; opacity: 0.7; }
}

/* ── CONTENT SECTION ────────────────────────────────────────── */
.panel-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 580px;
}

.content-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.content-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #a89968;
  font-weight: 400;
  margin: 0 0 0.5rem 0;
  animation: slide-up 0.6s ease;
}

.content-headline {
  font-family: "Cormorant Garamond", serif;
  font-size: 2.2rem;
  font-weight: 300;
  line-height: 1.2;
  color: #3f2817;
  margin: 0;
  animation: slide-up 0.6s ease 0.1s backwards;
}

.content-headline em {
  font-style: italic;
  font-weight: 300;
  color: #c9a96e;
  display: inline-block;
  animation: highlight-in 0.6s ease 0.3s backwards;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes highlight-in {
  from { opacity: 0; transform: scaleX(0); transform-origin: left; }
  to { opacity: 1; transform: scaleX(1); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── DIVIDER ────────────────────────────────────────────────── */
.divider-line {
  height: 1px;
  background: linear-gradient(90deg, rgba(201, 169, 110, 0.3) 0%, rgba(201, 169, 110, 0.05) 100%);
  margin: 1.2rem 0;
  animation: expand 0.8s ease 0.2s backwards;
}

/* ── FEATURES LIST ──────────────────────────────────────────── */
.features-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 1.3rem 1.6rem;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(201, 169, 110, 0.15);
  border-radius: 0.375rem;
  backdrop-filter: blur(4px);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: feature-slide-in 0.5s ease both;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.feature-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-accent) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.feature-item:hover::before {
  opacity: 1;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(201, 169, 110, 0.35);
  transform: translateX(4px) translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 110, 0.15);
}

@keyframes feature-slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
}

.feature-text strong {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3f2817;
  letter-spacing: 0.2px;
  line-height: 1.2;
}

.feature-text span {
  font-size: 0.75rem;
  color: #a89968;
  font-weight: 300;
  line-height: 1.5;
}

/* ── STATS ROW ──────────────────────────────────────────────── */
.stats-row {
  display: flex;
  gap: 0.8rem;
  padding-top: 0.5rem;
  animation: stats-fade-in 0.6s ease 0.4s backwards;
}

@keyframes stats-fade-in {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.9rem 0.5rem;
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(201, 169, 110, 0.12);
  border-radius: 0.375rem;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.stat-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.stat-item:hover::after {
  opacity: 1;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(201, 169, 110, 0.25);
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(201, 169, 110, 0.12);
}

.stat-value {
  font-family: "Cormorant Garamond", serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #c9a96e;
  line-height: 1;
  transition: all 0.3s ease;
  animation: number-increment 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.stat-item:hover .stat-value {
  transform: scale(1.2);
  color: #d4a354;
}

@keyframes number-increment {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.stat-label {
  font-size: 0.7rem;
  color: #a89968;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: center;
  font-weight: 600;
}

/* ── FLOATING ELEMENTS ──────────────────────────────────────── */
.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.float-element {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 169, 110, 0.15) 0%, transparent 70%);
  animation: float-gentle linear infinite;
  filter: blur(2px);
}

.element-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  right: 5%;
  animation-duration: 20s;
  animation-delay: 0s;
}

.element-2 {
  width: 80px;
  height: 80px;
  bottom: 15%;
  left: 8%;
  animation-duration: 25s;
  animation-delay: 2s;
}

.element-3 {
  width: 60px;
  height: 60px;
  top: 50%;
  right: 10%;
  animation-duration: 18s;
  animation-delay: 4s;
}

@keyframes float-gentle {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    transform: translateY(-30px) translateX(15px) scale(1.1);
    opacity: 0.05;
  }
}

/* ── ACCENT LINES ───────────────────────────────────────────── */
.accent-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.accent-line {
  position: absolute;
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.2) 0%, transparent 100%);
  pointer-events: none;
}

.line-1 {
  width: 300px;
  height: 1px;
  top: 25%;
  left: -300px;
  animation: slide-right 3s ease-in-out infinite;
}

.line-2 {
  width: 250px;
  height: 1px;
  top: 50%;
  right: -250px;
  animation: slide-left 4s ease-in-out infinite;
}

.line-3 {
  width: 200px;
  height: 1px;
  bottom: 30%;
  left: -200px;
  animation: slide-right 3.5s ease-in-out infinite 1s;
}

@keyframes slide-right {
  0% { transform: translateX(0); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateX(600px); opacity: 0; }
}

@keyframes slide-left {
  0% { transform: translateX(0); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateX(-500px); opacity: 0; }
}

/* ── TRANSITIONS ────────────────────────────────────────────── */
.content-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.content-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
