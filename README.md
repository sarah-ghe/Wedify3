# Eternelle — Wedding Vendor Marketplace

Eternelle is a full-featured wedding vendor marketplace that connects **couples** planning their wedding with **vendors** offering wedding services. Built with Vue 3, Vite, Supabase, and Pinia.

---

## App Functionality Summary

### 1. Authentication & User Management

- **Email/Password Sign Up & Sign In** — Users register with email, password, full name, and phone number.
- **Role-Based Accounts** — Every user signs up as either a **Couple** or a **Vendor**, unlocking a tailored experience.
- **Forgot Password & Reset Flow** — Password recovery via email with a dedicated reset-password page.
- **Session Persistence** — Automatic session restoration keeps users logged in across browser sessions.
- **Route Guards** — Protected dashboard routes redirect unauthenticated users to the login page.

### 2. Couple Features

- **Wedding Profile** — Couples create and manage their wedding profile including wedding date, budget, region, guest count, and venue preference.
- **Wedding Checklist** — A task management system to track wedding to-dos with due dates and completion status (add, update, toggle, remove tasks).
- **Wedding Budget Tracker** — Monitor and manage wedding spending with dedicated budget management tools.
- **Favorite Vendors** — Save and manage a personal list of favorite vendors for easy comparison and quick access.
- **Couple Dashboard** — A centralized control panel to access all couple-specific features.

### 3. Vendor Features

- **Vendor Business Setup** — Guided onboarding that collects business details, service regions, service type, niche-specific options, packages, promotions, rest days, and portfolio tags.
- **7 Specialized Service Categories**, each with tailored niche options:
  - 💄 **Beauty** — Hair styling, makeup, nail services, skin care
  - 👗 **Clothing** — Wedding attire and fashion
  - 🎵 **Music** — Malouf, gasba, fkairat, band, DJ, solo artist
  - 🎪 **Event Organizer** — Full wedding planning and coordination
  - 🍽️ **Savory/Catering** — Food and catering services
  - 🚗 **Transport** — Wedding transportation
  - 🏛️ **Venue** — Event spaces with capacity, parking, and decoration info
- **Package Management** — Create and manage service packages with pricing and feature details; supports daily booking packages.
- **Promotions Engine** — Run time-limited promotions with discount pricing and active/inactive status control.
- **Portfolio & Media** — Upload images and videos to showcase work, with portfolio tagging to cross-reference collaborating vendors.
- **Rest Days & Availability** — Set recurring rest days and mark specific dates as unavailable.
- **Vendor Reviews** — Receive and display client reviews with ratings.
- **Vendor Referrals** — Track and manage referrals between vendors.
- **Multi-Region Support** — Operate across multiple regions from a single vendor profile.
- **Vendor Dashboard** — A centralized panel for managing all vendor operations.

### 4. Marketplace & Discovery

- **Vendor Browsing** — Browse all listed vendors with rich profile information.
- **Advanced Filtering System** with 8 specialized filters applied in sequence:
  - 🔍 **Search** — Free-text search across vendor listings
  - 📍 **Region** — Filter by geographic coverage area
  - 🏷️ **Vendor Type** — Filter by service category (beauty, venue, music, etc.)
  - ⭐ **Minimum Rating** — Filter by review score
  - 🎯 **Service-Type Options** — Drill into niche-specific attributes (e.g., "has parking" for venues)
  - 💰 **Price Range** — Filter by maximum package price
  - 🎁 **Promotion Highlights** — Surface vendors with active promotions
  - 📅 **Availability** — Check vendor availability for a specific date
- **Vendor Public Profile** — Detailed vendor pages showing packages, portfolio, regions, promotions, reviews, niche details, and portfolio tags.
- **Similar Vendors** — Intelligent recommendations of similar vendors based on service type, region, and pricing.

### 5. Real-Time Messaging

- **Conversations** — Couples and vendors communicate through dedicated conversation threads with a unique constraint ensuring one conversation per couple-vendor pair.
- **Real-Time Messages** — Powered by Supabase Realtime for instant message delivery with live INSERT/UPDATE subscriptions.
- **Rich Message Types** — Support for text, images, files, booking requests, and system messages.
- **File Attachments** — Upload and share images and files directly in chat via Supabase Storage.
- **Typing Indicators** — Real-time broadcast of typing status to conversation participants.
- **Unread Count Tracking** — Global and per-conversation unread message badges.
- **Message Management** — Soft-delete messages with ownership verification; cursor-based pagination for large conversations.
- **Conversation Controls** — Archive, block, soft-delete, and restore conversations.
- **Bot Messages** — System can send automated bot messages within conversations.
- **Role-Aware Views** — Conversation lists are filtered based on user role (couple vs. vendor) with soft-delete awareness.

### 6. Shared UI Components

- **FormField** — Reusable form input with icon support and password visibility toggle.
- **Toast Notifications** — Success/error notification system with auto-dismiss.
- **Themed Design** — Consistent wedding-themed styling with a dedicated theme configuration.
- **Decorative Auth Panel** — Animated feature showcase on the login/signup page, dynamically switching between couple and vendor value propositions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Vue 3 (Composition API + `<script setup>`) |
| Build Tool | Vite |
| Backend / Database | Supabase (Auth, Database, Storage, Realtime) |
| State Management | Pinia |
| Routing | Vue Router 4 (with auth guards) |
| Language | TypeScript |
| Testing | Vitest + Vue Testing Library (47 test files) |
| Code Quality | ESLint + Prettier |

---

## Architecture

The app follows a **feature-based modular architecture**:

```
src/features/
├── auth/          → Authentication (login, signup, password reset, session restore)
├── couples/       → Couple-specific features (profile, checklist, budget, favorites)
├── dashboard/     → Role-based dashboard routing (couple vs. vendor)
├── marketplace/   → Vendor discovery and filtering
├── messaging/     → Real-time chat system
├── shared/        → Reusable components, types, styles, and themes
└── vendors/       → Vendor management (business setup, packages, portfolio, etc.)
```

Each feature module contains:
- **`services/`** — Supabase data-access layer (CRUD operations)
- **`composables/`** — Vue Composition API hooks for reactive state and business logic
- **`stores/`** — Pinia stores for global state management
- **`types/`** — TypeScript interfaces and type definitions
- **`components/`** — Vue single-file components
- **`views/`** — Page-level components
- **`styles/`** — Feature-specific CSS

---

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**
   ```
   cd Wedify3
   ```

3. **Install dependencies:**
   ```
   npm install
   ```

4. **Run the development server:**
   ```
   npm run dev
   ```

5. **Run tests:**
   ```
   npm test
   ```

---

## License

This project is licensed under the MIT License.
