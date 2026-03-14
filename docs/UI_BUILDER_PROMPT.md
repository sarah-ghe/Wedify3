# Eternelle — Complete UI Builder Prompt

> **App Name:** Eternelle
> **Type:** Wedding Vendor Marketplace (two-sided platform)
> **Users:** Couples planning their wedding + Vendors offering wedding services
> **Tech Stack:** Vue 3 + TypeScript, Supabase (Auth, Database, Storage, Realtime), Pinia, Vue Router 4, Vite
> **Design Theme:** Luxury wedding aesthetic — goldenrod primary (#b8860b), amber accent (#fbbf24), dark brown text (#3f2817), serif + sans font pairing, elegant animations

---

## FEATURE 1: Authentication & Onboarding

### 1A — Auth Landing Page (Split Layout)

**Layout:** Two-panel split-screen on desktop (50/50). On mobile (<1024px), only the right form panel shows with a compact mobile logo.

**Left Panel — Decorative Showcase:**
- Displays the brand name "Eternelle" at the top with a ✦ logo symbol
- Auto-rotates between "couple" and "vendor" content every 16 seconds (on login view)
- On signup, it locks to whichever role the user selects
- **Couple content headline:** "Plan Your Perfect Day"
- **Vendor content headline:** "Grow Your Business"
- Shows a list of 5–8 animated feature highlights (fade in one by one with staggered delay):
  - **For Couples:** AI-Powered Vendor Matching, Automated Wedding Roadmap, Instant Booking & Smart Waitlists, Unified Wedding Dashboard, Budget Intelligence, Seamless Social-to-App Experience, Verified Reviews & Top Vendors
  - **For Vendors:** Instant Lead Generation, AI Social Media Booking Bots, Advanced Booking Management, Zero-Empty-Slot Protection, Marketplace Hotspots, Portfolio & Promotions Engine, Collaboration & Vendor Tagging, Multi-Business Management
- Each feature has a bold label + a description paragraph
- Below the features, a stats row:
  - **For Couples:** "500+ Vendors", "4 Cities Coverage", "Free To Join"
  - **For Vendors:** "3x More Leads", "24/7 Bot Active", "Free To List"
- Decorative floating animated elements: accent lines, rotating rings
- Dark gradient background with golden accents
- Uses Cormorant Garamond (serif) + DM Sans (sans) fonts

**Right Panel — Form Area:**
- Mobile logo at top (hidden on desktop): ✦ symbol + "Eternelle" + divider line
- Tab switcher: "Sign In" / "Create Account" — two buttons, active state highlighted
- Form container below tabs

### 1B — Login Form
- **Header:** "Welcome back" + subtitle "Continue planning your beautiful day"
- **Fields:**
  - Email (text input, mail icon on left, placeholder "your@email.com")
  - Password (password input, lock icon on left, show/hide toggle eye icon on right)
- **Forgot Password link** (right-aligned, opens modal)
- **Submit button:** "Sign In" (full-width, styled primary button)
- **Divider:** horizontal line with "or" text centered
- **Switch link:** "Don't have an account? → Create one"

### 1C — Sign Up Form
- **Header:** "Begin your journey" + subtitle "Join thousands planning their perfect wedding"
- **Role Selector** (two buttons side by side):
  - "We're a Couple" (heart icon) — selects `couple` role
  - "I'm a Vendor" (store icon) — selects `vendor` role
  - Active state: highlighted/selected visual
- **Fields** (labels change based on role):
  - Name: label "Your Names" / "Business Name", placeholder "Alex & Jordan" / "Your Business Name", icon heart / store
  - Email: label "Email", placeholder "your@email.com", icon mail
  - Password: label "Password", placeholder "••••••••", icon lock, show/hide toggle
- **Submit button:** "Start Planning Together ✦" (couple) or "List Your Services ✦" (vendor)
- **Terms text:** "By signing up you agree to our Terms & Privacy Policy"
- **Divider:** "or"
- **Switch link:** "Already have an account? → Sign in"

**Data collected on signup:** email, password, username (full_name), phoneNumber, role (couple/vendor). User record is created in Supabase Auth + a "users" table row with: id, phone_number, full_name, email, role, is_profile_completed=false.

### 1D — Forgot Password Modal
- Opens as a centered modal overlay on top of auth page
- **Close button (✕)** in top-right
- **Header:** "Reset Password" + "We'll send you a recovery link"
- **Email input** (mail icon)
- **Submit button:** "Send Reset Email"
- **Success/Error message** display below button
- **Switch link:** "Remember your password? → Sign in"
- Sends password reset email via Supabase with redirect to `/reset-password`

### 1E — Reset Password Page (`/reset-password`)
- Standalone full page (no split layout)
- **Header:** "Set New Password"
- **Password input** with eye toggle show/hide
- **Submit button:** "Update Password"
- **Success message:** "Password updated successfully! Redirecting..." → auto-redirects to `/auth` after 2 seconds
- **Error handling:** Shows error messages inline

### 1F — Session Restore
- On app mount, the system checks for an existing Supabase session
- If found, queries the "users" table for the user's role
- Auto-redirects to `/dashboard/{userId}` if session + role are valid
- No UI needed — this is silent background behavior

---

## FEATURE 2: Dashboard (Role-Based Routing)

### Route: `/dashboard/:userId`

**Dashboard Wrapper Logic:**
- On mount, verifies the authenticated user's ID matches the URL param
- Fetches user role from "users" table
- Renders either `CoupleDashboard` or `VendorDashboard` based on role
- Redirects to `/auth` if session is invalid or user ID doesn't match

### 2A — Couple Dashboard
> **Note:** Currently a placeholder. Needs full UI design.

**Current state:** Shows heading "Couple Dashboard", user ID, and logout button.

**Intended features to build UI for:**
- Wedding Profile overview (wedding date, budget, region, guest count, venue preference)
- Wedding Checklist / Task manager
- Budget tracker widget
- Favorite vendors list
- Quick access to marketplace browsing
- Quick access to messaging

### 2B — Vendor Dashboard
> **Note:** Currently a placeholder. Needs full UI design.

**Current state:** Shows heading "Vendor Dashboard", user ID, and logout button.

**Intended features to build UI for:**
- Business profile overview
- Package management
- Promotion management
- Portfolio/media gallery
- Availability calendar (rest days + unavailable dates)
- Booking/lead management
- Reviews display
- Analytics/stats

---

## FEATURE 3: Couple Features (Wedding Planning Tools)

### 3A — Wedding Profile Management

**Data model (`couple_weddings` table):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| user_id | string | Foreign key to auth user |
| wedding_date | string (date) | Planned wedding date |
| budget | number | Total wedding budget |
| region | string | Wedding region/city |
| guest_count | number | Expected guest count |
| venue_preference | string (optional) | Preferred venue type |

**Operations:**
- Create wedding profile (first-time setup)
- View/Edit wedding profile
- Fetch profile by user ID

**UI needed:**
- Wedding profile setup form (onboarding step after signup)
- Wedding profile display card on dashboard
- Edit profile modal/form

### 3B — Wedding Checklist (Task Manager)

**Data model (`couple_wedding_tasks` table):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| wedding_id | string | Foreign key to wedding profile |
| task | string | Task description text |
| due_date | string (date) | Task deadline |
| is_completed | boolean | Completion status |

**Operations:**
- Fetch all tasks for a wedding
- Add new task (task text + due date)
- Update task details
- Toggle task completion (checkbox)
- Remove/delete task

**UI needed:**
- Checklist view on couple dashboard
- Each task: checkbox + task text + due date + delete button
- "Add task" input row (text input + date picker + add button)
- Progress indicator (X of Y tasks completed)
- Sort/filter by due date or completion status

### 3C — Wedding Budget Tracker

**Data model:** Uses `couple_weddings.budget` as total budget, with a reactive tracking system.

**Operations:**
- View total budget vs. used budget vs. remaining budget
- Increase used budget (when booking a vendor)
- Decrease used budget (when canceling)
- Reset used budget

**UI needed:**
- Budget overview card: total / spent / remaining
- Visual progress bar or pie chart
- Budget breakdown by category (future enhancement)

### 3D — Favorite Vendors

**Data model (`CouplesFavoriteVendors` table):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| user_id | string | Couple's user ID |
| vendor_id | string | Favorited vendor ID |

**Operations:**
- Fetch all favorite vendors for user
- Add vendor to favorites (heart/bookmark action)
- Remove vendor from favorites
- Check if specific vendor is favorited (for toggle state)

**UI needed:**
- Heart/bookmark toggle button on vendor cards in marketplace
- "My Favorites" section on couple dashboard
- Favorite vendors list (shows vendor cards with name, type, rating)
- Remove from favorites action

---

## FEATURE 4: Vendor Features (Business Management)

### 4A — Vendor Business Setup (Onboarding Wizard)

**This is a multi-step wizard that collects all vendor business data in one flow.**

**Step 1 — Business Details:**

Data model (`vendors` table):
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| user_id | string | Foreign key to auth user |
| business_name | string | Business display name |
| service_type_id | string | Category (beauty, venue, music, etc.) |
| description | string (optional) | Business description |
| rating | number (optional) | Average rating (calculated) |
| reviews_count | number (optional) | Total reviews (calculated) |
| created_at | string | Auto-generated timestamp |

UI: Business name input, service type dropdown/selector, description textarea.

**Step 2 — Service Regions:**

Data model (`vendor_regions` table):
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| vendor_id | string | Foreign key to vendor |
| region_name | string | Region/city name |

UI: Multi-select or tag input for regions the vendor serves.

**Step 3 — Niche-Specific Options:**

Based on the selected service type, show a different set of toggles/options:

**Beauty** (`data_beauty_options` table):
- hair_styling (boolean toggle)
- makeup (boolean toggle)
- nail_services (boolean toggle)
- skin_care (boolean toggle)
- other (boolean toggle)

**Clothing — Algerian Traditional** (`data_clothing_options` table):
- accessories, badroune, benouare, blouza_wahrani, bouza_mansouj, caftan, chedda, evening_dress, gandoura, ghelila, karakou, katifa_fergani, leffa, naili, wedding_dress, barnous, suit, tuxedo, other (all boolean toggles)

**Music — Algerian Styles** (`data_music_options` table):
- malouf (boolean toggle)
- gasba (boolean toggle)
- fkairat (boolean toggle)
- band (boolean toggle)
- dj (boolean toggle)
- solo_artist (boolean toggle)
- other (boolean toggle)

**Event Organizer** (`data_organizer_options` table):
- no_camera (boolean toggle — means photographer not included)
- organizer (boolean toggle)
- caffe_service (boolean toggle — coffee service)

**Savory / Catering** (`data_savory_options` table):
- appetizers (boolean toggle)
- buffet (boolean toggle)
- drinks (boolean toggle)
- pastry (boolean toggle)
- wedding_cake (boolean toggle)
- dinner (boolean toggle)
- other (boolean toggle)

**Transport** (`data_transport_options` table):
- has_limousines (boolean toggle)
- has_sport_cars (boolean toggle)
- has_suv_cars (boolean toggle)
- has_motorbikes (boolean toggle)

**Venue** (`data_venue_options` table):
- max_guests (number input)
- min_guests (number input, optional)
- decorated (boolean toggle)
- has_parking_space (boolean toggle)
- parking_slots (number input, optional — shown if has_parking_space is true)

UI: Dynamic form that changes based on service type. Grid of toggle switches/checkboxes, plus number inputs where applicable.

**Step 4 — Packages:**

Data model (`vendor_packages` table):
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| vendor_id | string | Foreign key to vendor |
| name | string | Package name |
| price | number | Package price |
| description | string (optional) | Package description |
| features | any (JSON) | Package features/inclusions |
| is_daily_booking | boolean | Whether this is a per-day booking |
| hour_range | number (optional) | Hours included |
| has_multi_booking | boolean (optional) | Allows multiple bookings same day |
| is_promo | boolean (optional) | Is promotional package |

UI: Add/edit/remove packages. Each package card shows: name, price, description, feature list, booking type toggle.

**Step 5 — Promotions:**

Data model (`vendor_promotions` table):
| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-generated |
| vendor_id | string | Foreign key to vendor |
| name | string | Promotion name |
| price | number | Original price |
| discount_price | number | Discounted price |
| start_date | string (date) | Promotion start |
| end_date | string (date) | Promotion end |
| status | string | active / inactive |
| description | string (optional) | Promotion description |
| package_id | string (optional) | Linked package |
| benefits | any (JSON, optional) | Extra benefits |
| features | any (JSON, optional) | Included features |

UI: Add/edit/remove promotions. Each shows: name, original price vs. discount price (with strikethrough), date range, status badge.

**Step 6 — Rest Days (Weekly Schedule):**

Data model (`vendors_rest_days` table):
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| vendor_id | string | Foreign key to vendor |
| day_of_week | string | Day name (e.g., "Monday") |

UI: 7-day week selector — toggle which days are rest days (vendor is unavailable).

**Step 7 — Portfolio Tags:**

Data model (`vendors_portfolio_tags` table):
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| vendor_id | string | The vendor who owns the portfolio |
| tagged_vendor_id | string | The vendor being tagged in the photo |
| file_id | string | The portfolio file being tagged |

UI: Tag other vendors in portfolio photos (cross-promotion/collaboration feature).

**Setup Flow:**
The business setup executes all steps in sequence: Create vendor → Create regions → Create niche options → Create packages → Create promotions → Create rest days → Create portfolio tags. Has rollback capability if any step fails.

### 4B — Package Management (Post-Setup)

After initial setup, vendors can manage their packages independently:
- **View all packages** for their business
- **Create new package** with all fields above
- **Edit existing package** (partial updates)
- **Delete package**

UI: Package list view with cards, add button, edit/delete actions per card.

### 4C — Portfolio & Media Management

**Data model (`vendor_portfolio_files` + Supabase Storage):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| vendor_id | string | Foreign key to vendor |
| file_url | string | Public URL to file in Supabase Storage |
| file_type | "image" \| "video" | File type |
| description | string (optional) | Caption/description |
| created_at | string | Upload timestamp |

**Operations:**
- Upload file to Supabase Storage → Create metadata record
- View all portfolio files for vendor
- Delete file (removes from storage + metadata)

**UI needed:**
- Media gallery grid (masonry or grid layout)
- Upload button (drag-and-drop or file picker)
- Image/video preview
- Delete button per item
- Tag other vendors in photos (portfolio tags)

### 4D — Unavailable Dates

**Data model (`vendor_unavailable_dates` table):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| vendor_id | string | Foreign key to vendor |
| date | string (date) | Specific unavailable date |
| reason | string (optional) | Reason for unavailability |

**Operations:**
- View all unavailable dates
- Add specific date as unavailable (with optional reason)
- Remove unavailable date
- Batch add/remove dates

**UI needed:**
- Calendar view showing available/unavailable dates
- Click date to mark unavailable (with reason input)
- Click again to mark available
- Integration with rest days (weekly recurring) shown differently from one-off dates

### 4E — Reviews (Read-Only for Vendors)

**Data model (`vendor_reviews` table):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| user_id | string | Reviewer (couple) ID |
| vendor_id | string | Reviewed vendor ID |
| rating | number | Rating score (1-5) |
| review | string | Review text |
| created_at | string | Review timestamp |

**UI needed:**
- Reviews list on vendor profile
- Star rating display
- Review text
- Reviewer info
- Average rating and total count summary

### 4F — Vendor Referrals

**Data model (`vendor_referrals` table):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| from_vendor_id | string | Referring vendor |
| to_vendor_id | string | Referred vendor |
| booking_id | string | Associated booking |
| note | string (optional) | Referral note |

**UI needed:**
- Referral management section
- Send referral (select vendor + note)
- View incoming/outgoing referrals
- Referral linked to booking context

---

## FEATURE 5: Marketplace (Vendor Discovery & Browsing)

### 5A — Marketplace Browse Page

**Filter System:** 8 filters applied sequentially to narrow results:

1. **Search** (text input) — Matches vendor `business_name` or `description` (case-insensitive)
2. **Region** (dropdown/select) — Filters vendors who serve selected region
3. **Vendor Type** (dropdown/select) — Filters by service category:
   - beauty, clothing, music, organizer, savory, transport, venue
4. **Minimum Rating** (slider or number input) — Filters vendors with rating ≥ value
5. **Service-Type Options** (dynamic checkboxes) — Category-specific sub-filters:
   - e.g., for Beauty: hair_styling, makeup, nail_services, skin_care
   - e.g., for Venue: max_guests, decorated, parking
   - Changes dynamically based on selected vendor type
6. **Max Price** (slider or number input) — Filters by cheapest package price ≤ value
7. **Promotion Highlights** (toggle) — Show only vendors with active promotions on selected date
8. **Availability** (date picker) — Filters out vendors unavailable on selected date (checks rest days + unavailable dates)

**Vendor Card Display (for each result):**
- Business name
- Service type badge
- Rating (stars + number)
- Description snippet
- Price range (from cheapest package)
- Region tags
- Active promotion badge (if applicable)
- Favorite toggle (heart) for logged-in couples

**UI needed:**
- Filter sidebar or top filter bar
- Vendor card grid (responsive: 1 col mobile, 2 col tablet, 3-4 col desktop)
- Loading state
- Empty state ("No vendors match your filters")
- Search input with debounce
- Filter clear/reset button

### 5B — Vendor Public Profile Page

**Displays all information about a single vendor. Fetches everything in parallel:**

**Header Section:**
- Business name
- Service type
- Rating (stars + count)
- Region tags
- Description

**Packages Section:**
- List of all packages
- Each shows: name, price, description, features, booking type (daily/hourly), promo badge

**Portfolio Section:**
- Media gallery of uploaded images/videos
- Portfolio tags showing collaborating vendors

**Promotions Section:**
- Active promotions with original price → discount price
- Promotion date range and status

**Reviews Section:**
- All reviews with star ratings and text
- Average rating summary

**Niche Details Section:**
- Service-specific attributes (e.g., for venue: max guests, parking, decoration)

**Similar Vendors Section:**
- Recommended similar vendors (up to 5)
- Matching criteria: same service type → shared regions → similar price range (±20%) → similar rating (±0.5) → shared niche options
- Sorted by rating (desc), then price (asc)

**Actions:**
- "Contact Vendor" button → Opens/creates messaging conversation
- "Add to Favorites" toggle
- "Book Now" flow (future)

---

## FEATURE 6: Real-Time Messaging

### 6A — Conversations List

**Data model (`messaging_conversations` table):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| couple_id | string | Couple participant |
| vendor_id | string | Vendor participant |
| status | 'active' \| 'archived' \| 'blocked' | Conversation status |
| deleted_by_couple | boolean | Soft delete for couple |
| deleted_by_vendor | boolean | Soft delete for vendor |
| deleted_by_couple_at | timestamp (optional) | When couple deleted |
| deleted_by_vendor_at | timestamp (optional) | When vendor deleted |
| created_at | timestamp | |
| updated_at | timestamp | |

**Display per conversation item:**
- Participant name and avatar
- Last message preview text
- Last message timestamp
- Unread count badge
- Conversation status indicator

**Operations:**
- Load all conversations (filtered by soft-delete for current user's role)
- Start new conversation (get or create — unique constraint per couple-vendor pair)
- Set active conversation (select from list)
- Archive conversation
- Block conversation
- Soft-delete conversation (hides from user's view, row stays in DB)
- Restore soft-deleted conversation

**UI needed:**
- Conversation list sidebar (scrollable)
- Each item: avatar, name, last message preview, time, unread badge
- Search/filter conversations
- New conversation button
- Right-click or swipe menu: Archive, Block, Delete
- Active conversation highlight
- Sorted by most recent activity (updatedAt desc)

### 6B — Chat View (Message Thread)

**Data model (`messaging_messages` table):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| conversation_id | string | Parent conversation |
| sender_id | string | Who sent it |
| sender_role | 'couple' \| 'vendor' \| 'bot' | Sender type |
| content | string \| null | Message text (null if deleted) |
| content_type | 'text' \| 'image' \| 'file' \| 'booking_request' \| 'system' | Message type |
| status | 'sent' \| 'delivered' \| 'read' | Delivery status |
| read_at | timestamp (optional) | When read |
| is_deleted | boolean | Soft delete flag |
| deleted_at | timestamp (optional) | When deleted |
| metadata | JSON (optional) | Extra data for booking_request or system messages |
| created_at | timestamp | |

**Attachment data model (`messaging_attachments` table):**
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Auto-generated |
| message_id | string | Parent message |
| url | string | Public URL to file |
| file_name | string (optional) | Original file name |
| file_size | number (optional) | File size in bytes |
| mime_type | string (optional) | MIME type |

**Message Types to render:**
1. **Text** — Simple text bubble
2. **Image** — Image preview with lightbox
3. **File** — File attachment with download link (show file name, size, type)
4. **Booking Request** — Special card with: package name, date, status badge (pending/confirmed/rejected/cancelled)
5. **System** — System notification style (centered, muted text): booking_confirmed, booking_rejected, booking_cancelled, conversation_started

**Realtime Features:**
- New messages appear instantly (Supabase Realtime INSERT subscription)
- Message status updates (read receipts) update in real-time (UPDATE subscription)
- **Typing indicator:** Shows "Other person is typing..." with auto-clear after 3 seconds
- Debounced typing broadcast (1.5 second debounce)

**Operations:**
- **Open conversation:** Load messages + mark as read + subscribe to realtime
- **Close conversation:** Unsubscribe from realtime
- **Send message:** Optimistic UI (shows immediately with temp ID, replaces with real ID on confirmation)
- **Send with attachments:** Upload files to Supabase Storage (`messaging/{conversationId}/{messageId}/{filename}`), create attachment records
- **Load more (pagination):** Cursor-based — loads 30 messages at a time, "load more" button or infinite scroll at top
- **Delete message:** Soft delete (nulls content, sets is_deleted flag) — only message owner can delete
- **Mark as read:** Auto-marks messages as read when conversation is open

**UI needed:**
- Chat message list (scrollable, newest at bottom)
- Message bubbles: sender on right, receiver on left, bot/system centered
- Message bubble shows: content, timestamp, read receipt icon (✓ / ✓✓)
- Deleted message placeholder: "This message was deleted"
- Typing indicator bar at bottom
- Message input area: text input + attachment button + send button
- File preview before sending
- Image messages: thumbnail in chat, click to enlarge
- Booking request card: styled differently from regular messages
- "Load more" indicator at top of chat
- Empty state for new conversation

### 6C — Unread Count Badge

**Global unread tracking:**
- Stays alive for entire user session
- Subscribes to all new messages across all user's conversations
- Updates count when new message arrives in any conversation
- Decrements when user reads a conversation

**UI needed:**
- Badge on messaging icon/tab in navigation
- Per-conversation unread count in conversation list
- Badge clears when conversation is opened

### 6D — Messaging State Management (Pinia Store)

**Full state shape:**
```
{
  conversations: Conversation[]
  activeConversationId: string | null
  messages: { [conversationId]: Message[] }
  unreadCount: number
  loadingConversations: boolean
  loadingMessages: boolean
  sending: boolean
  error: string | null
}
```

**Computed/Getters:**
- `activeConversation` — current conversation object
- `activeMessages` — messages for current conversation
- `sortedConversations` — sorted by updatedAt desc
- `conversationIds` — all conversation IDs
- `unreadPerConversation` — unread counts per conversation

---

## FEATURE 7: Shared UI Components & Design System

### 7A — Design Tokens (CSS Variables)

```css
/* Colors */
--color-primary: #b8860b        /* Goldenrod — primary actions */
--color-accent: #fbbf24         /* Amber — highlights */
--color-text-dark: #3f2817      /* Dark brown — headings */
--color-text-light: #a89968     /* Muted gold — secondary text */
--color-text-muted: #d4cfc5     /* Light — disabled/placeholder */
--color-bg-light: #faf9f7       /* Off-white — backgrounds */
--color-bg-overlay: rgba(63, 40, 23, 0.6)  /* Dark overlay */
--color-border: #e7e5e4         /* Light border */
--color-success: #22c55e        /* Green — success states */
--color-success-light: #f0fdf4  /* Light green background */
--color-error: #ef4444          /* Red — error states */
--color-error-light: #fef2f2    /* Light red background */

/* Fonts */
--font-serif: 'Cormorant Garamond', Georgia, serif    /* Headlines */
--font-sans: 'DM Sans', 'Segoe UI', sans-serif        /* Body text */

/* Spacing Scale */
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 1rem       /* 16px */
--spacing-lg: 1.5rem     /* 24px */
--spacing-xl: 2rem       /* 32px */

/* Border Radius */
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px

/* Transitions */
--transition-fast: 0.2s ease
--transition-normal: 0.3s ease
--transition-slow: 0.5s ease
```

### 7B — FormField Component
- **Props:** modelValue, label, type, placeholder, icon, showToggle
- **Icons available:** mail (envelope SVG), lock (padlock SVG), heart (heart SVG), store (storefront SVG)
- Icon positioned on left side of input
- Optional password show/hide toggle on right side
- Styled with the design token variables
- Full-width input

### 7C — Toast Notification Component
- **Props:** message (string), type ('success' | 'error' | 'info'), visible (boolean), duration (number, default 4000ms)
- **Positioning:** Fixed bottom-right corner (responsive: bottom-center on mobile)
- **Icons:** Checkmark circle (success), X circle (error), Info circle (info)
- **Colors:** Green gradient (success), Red gradient (error), Blue gradient (info)
- Close button (✕)
- Auto-dismisses after duration
- Backdrop blur effect
- Smooth slide-in / fade-out animation

### 7D — Header Component
- Displays "Eternelle" branding
- Optional navigation slot
- `showNav` prop to toggle navigation visibility

### 7E — SubmitButton Component
- Full-width styled button
- Accepts slot content for label text
- Primary color styling with hover/active states

### 7F — SwitchButton Component
- Text + clickable link combination (e.g., "Don't have an account? → Create one")
- Used for auth form switching

---

## FEATURE 8: Routing & Navigation

### Routes:
| Path | Name | Auth Required | Component |
|------|------|:---:|-----------|
| `/` | — | No | Redirects to `/auth` |
| `/auth` | Login | No | AuthView (Login/Signup) |
| `/reset-password` | ResetPassword | No | ResetPasswordView |
| `/dashboard/:userId` | Dashboard | **Yes** | DashboardWrapper → CoupleDashboard / VendorDashboard |

### Route Guard:
- `beforeEach` navigation guard checks `meta.requiresAuth`
- Verifies Supabase session exists
- Redirects to `/auth` if no session and route requires auth

### Routes Needed (to be built):
- `/marketplace` — Vendor browsing
- `/marketplace/:vendorId` — Vendor public profile
- `/messages` — Messaging inbox
- `/messages/:conversationId` — Chat view
- `/settings` — User settings
- `/vendor/setup` — Vendor business setup wizard

---

## DATABASE TABLES SUMMARY

### Auth & Users
- `auth.users` (Supabase Auth built-in)
- `users` — id, phone_number, full_name, email, role, is_profile_completed

### Couples
- `couples` — id, user_id, email, username, phone_number, created_at
- `couple_weddings` — id, user_id, wedding_date, budget, region, guest_count, venue_preference
- `couple_wedding_tasks` — id, wedding_id, task, due_date, is_completed
- `CouplesFavoriteVendors` — id, user_id, vendor_id

### Vendors
- `vendors` — id, user_id, business_name, service_type_id, description, rating, reviews_count, created_at
- `vendor_packages` — id, vendor_id, name, price, description, features (JSON), is_daily_booking, hour_range, has_multi_booking, is_promo
- `vendor_promotions` — id, vendor_id, name, price, discount_price, start_date, end_date, status, description, package_id, benefits (JSON), features (JSON), created_at
- `vendor_regions` — id, vendor_id, region_name
- `vendor_reviews` — id, user_id, vendor_id, rating, review, created_at
- `vendor_referrals` — id, from_vendor_id, to_vendor_id, booking_id, note
- `vendors_rest_days` — id, vendor_id, day_of_week
- `vendor_unavailable_dates` — id, vendor_id, date, reason
- `vendor_portfolio_files` — id, vendor_id, file_url, file_type, description, created_at
- `vendors_portfolio_tags` — id, vendor_id, tagged_vendor_id, file_id

### Service Types
- `service_types` — id, name
- `data_beauty_options` — id, vendor_id, hair_styling, makeup, nail_services, skin_care, other
- `data_clothing_options` — id, vendor_id, accessories, badroune, benouare, blouza_wahrani, bouza_mansouj, caftan, chedda, evening_dress, gandoura, ghelila, karakou, katifa_fergani, leffa, naili, wedding_dress, barnous, suit, tuxedo, other
- `data_music_options` — id, vendor_id, malouf, gasba, fkairat, band, dj, solo_artist, other
- `data_organizer_options` — id, vendor_id, no_camera, organizer, caffe_service
- `data_savory_options` — id, vendor_id, appetizers, buffet, drinks, pastry, wedding_cake, dinner, other
- `data_transport_options` — id, vendor_id, has_limousines, has_sport_cars, has_suv_cars, has_motorbikes
- `data_venue_options` — id, vendor_id, max_guests, min_guests, decorated, has_parking_space, parking_slots

### Messaging
- `messaging_conversations` — id, couple_id, vendor_id, status, deleted_by_couple, deleted_by_vendor, deleted_by_couple_at, deleted_by_vendor_at, created_at, updated_at
- `messaging_messages` — id, conversation_id, sender_id, sender_role, content, content_type, status, read_at, is_deleted, deleted_at, metadata (JSON), created_at
- `messaging_attachments` — id, message_id, url, file_name, file_size, mime_type, created_at

### Supabase Storage Buckets
- `wedify-messaging` — Messaging file attachments (path: `messaging/{conversationId}/{messageId}/{filename}`)
- Portfolio files storage (vendor portfolio uploads)
