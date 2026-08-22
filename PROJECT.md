# 🇮🇳 Bolo — Civic Connect (बोलो नागरिक कनेक्ट)

<!-- CODEX:BEGIN -->
<!-- CODEX:TAGS: openai, codex, civic-tech, react18, typescript, tanstack-router, tailwindcss, leaflet, firebase-realtime-database, i18n -->

> **Bolo Civic Connect** is an open, modern municipal grievance redressal and citizen reporting platform designed for Indian neighbourhoods.
>
> 🚀 **Built with OpenAI & Codex**

---

## 🌟 Overview & Purpose

In Indian towns, cities, and villages, civic issues like potholes, open drains, broken streetlights, unattended garbage, and water leaks often go unaddressed due to lack of visibility.

**Bolo** bridges the gap between citizens, municipal authorities, and community champions:
- **Interactive Community Map**: View civic complaints plotted accurately across Indian states, districts, and wards on an interactive Leaflet map.
- **Multi-Camera & Image Capture**: Citizens can raise issues using live device camera capture or photo gallery upload.
- **Live Firebase Realtime Database**: Real-time sync of complaints, statuses, and user profiles.
- **8 Regional Languages Support**: Native translation in English, Hindi (हिन्दी), Marathi (मराठी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), and Gujarati (ગુજરાતી).
- **Citizen Profile & Verification**: User account with verified badge (email/phone), live KPI of complaints raised, and editable personal records.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **AI & Code Generation** | **OpenAI & Codex** |
| **Frontend Framework** | React 18 + TypeScript |
| **Routing** | TanStack Router (File-based routing) |
| **State & Data Fetching** | TanStack Query + React Context |
| **Styling & Design System** | Tailwind CSS v4 + Radix UI Primitives + OKLCH colors |
| **Mapping Engine** | React Leaflet + Leaflet GeoJSON + CARTO Tiles |
| **Backend & Authentication** | Firebase Auth (Email/Password, Google OAuth, Phone OTP) |
| **Database** | Firebase Realtime Database (with live websocket subscription) |
| **Icons & Notifications** | Lucide React + Sonner Toasts |
| **Build & Tooling** | Vite + Bun / Node.js |

---

## 📂 Project Architecture

```
Bolo Civic Connect/
├── public/
│   ├── logo.png                # Brand Logo
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/                 # Civic illustrations & graphic assets
│   ├── components/
│   │   ├── auth-context.tsx    # Firebase authentication state provider
│   │   ├── language-context.tsx # Reactive i18n provider & useT() hook
│   │   ├── issue-map.tsx       # Leaflet India map with bounds locking & markers
│   │   ├── issue-list-card.tsx # Issue feed card component
│   │   ├── issue-detail-dialog.tsx # Full modal for issue details & gallery
│   │   ├── profile-panel.tsx   # User profile menu, verified badge, KPI, FAQ, Support
│   │   ├── site-header.tsx     # Sticky top navigation bar & language selector
│   │   ├── status-badge.tsx    # Problem Reported / Work in Progress / Solved badges
│   │   ├── loader.tsx          # Spinner-to-checkmark animated loader
│   │   └── ui/                 # Accessible Radix-based UI components (Dialog, Sheet, etc.)
│   ├── lib/
│   │   ├── firebase.ts         # Firebase initialization, Auth, & RTDB helpers
│   │   ├── i18n.ts             # 8-language translations dictionary & getT()
│   │   ├── india-boundary.json # GeoJSON boundary masking for India
│   │   ├── mock-data.ts        # Seed data, cities, districts, and date formatters
│   │   └── utils.ts            # Utility functions (cn merger)
│   ├── routes/
│   │   ├── __root.tsx          # Root shell, TanStack Query, Auth/Session gate
│   │   ├── index.tsx           # Home page (Map + filterable issue feed)
│   │   ├── explore.tsx         # Visual photo-led exploration gallery
│   │   ├── raise.tsx           # Raise complaint form (Camera + GPS + validation)
│   │   └── auth.tsx            # Login, Signup, Phone OTP & Google OAuth
│   ├── styles.css              # Theme tokens, custom typography, Leaflet styles
│   └── routeTree.gen.ts        # Generated TanStack Route Tree
├── AGENTS.md                   # Agent & coding standards (Codex & OpenAI)
├── PROJECT.md                  # Comprehensive project documentation
├── package.json
└── vite.config.ts
```

---

## ⚡ Key Features

### 1. 🗺️ Map-Centric Issue Tracker
- India-only bounded map view with custom CARTO basemap.
- Search by city, town, or landmark.
- Dynamic filtering by **State**, **District**, and **City**.
- Live geolocation centering (**"Use my location"**).
- Stacking context isolation ensuring modal dialogs render smoothly over map layers.

### 2. 📝 Issue Reporting with Camera & Geolocation
- **Photo Evidence**: Browse files or use the **"Take Photo"** button for direct camera capture.
- **Live GPS Capture**: **"Use my live location"** button attaches latitude and longitude coordinates.
- Multi-field validation with translated error messages in the user's active language.

### 3. 👤 Citizen Profile & Redressal KPI
- Accessible from the top navbar avatar.
- Displays **Verified** status badge if email or phone is verified.
- **KPI Card**: Displays total complaints raised by the logged-in user in real time.
- **Editable Profile**: Change legal name, display name, and phone number directly with changes saved to Firebase.
- Popup navigation: **Profile**, **Support**, **FAQ**, **Terms of Service**, and **Log out**.

### 4. 🌐 Multilingual Accessibility
- Full UI translation across **8 major Indian languages**.
- Reactive `useT()` hook guarantees instant language updates without page reloads.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Installation & Run
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Check TypeScript types
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 🔒 Security & Privacy
- Sensitive personal info (email, phone, legal name) is never shown on public complaints.
- Only the reporter's chosen display name and location details are public.
- Firebase Database security rules restrict profile updates to authenticated owners.

---

<!-- CODEX:END -->
