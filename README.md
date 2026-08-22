<div align="center">

# <img src="https://github.com/UMDhodi/Bolo/blob/main/public/logo.png" width="45" align="center" valign="middle"> Bolo The Civic Connect

**Report. Explore. Follow. Civic issues on a live map.**

![Built with OpenAI Codex](https://img.shields.io/badge/built%20with-OpenAI%20Codex-111827)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel&logoColor=white)](https://vercel.com)
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TanStack Router](https://img.shields.io/badge/TanStack-Router%20%26%20Query-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

> A citizen-facing prototype for reporting and tracking municipal issues road damage, streetlights, drainage, garbage, water leaks, and public spaces on a live interactive map.

</div>

## ✨ Features

- 🗺️ **Live Interactive Map** — Browse civic complaints on a Leaflet-powered map with real-time Firebase sync
- 📍 **Location-aware** — Auto-detect user location and geofence to India
- 📸 **Photo Upload** — Attach images (with in-browser compression) or capture via device camera
- 🔐 **Authentication** — Email/password, Google Sign-In, and Phone OTP via Firebase Auth
- 🌐 **Multilingual** — Reactive `useT()` hook with support for multiple Indian languages
- ⚡ **SSR + Edge** — TanStack Start with Nitro rendering, deployed as Vercel serverless functions
- 🔄 **Real-time** — Firebase Realtime Database keeps the map and complaint list in sync across all users
- 🛡️ **CSRF Protection** — Server function middleware guards all mutations

---

## 🏗️ Tech Stack

### 📦 pnpm — Package Manager

We use **pnpm** as the primary package manager for its:

- **Disk efficiency** — Shared content-addressable store avoids duplicating packages across projects
- **Strict dependency isolation** — Prevents phantom dependencies that npm/yarn allow by accident
- **Speed** — Parallel installs and hard-linking make pnpm significantly faster than npm
- **Lockfile integrity** — `pnpm-lock.yaml` is more deterministic, making CI/CD (`--frozen-lockfile`) reliable
- **Workspace support** — First-class monorepo support if the project ever scales

### 🐇 Bun — JavaScript Runtime & Tooling

**Bun** is included as an alternative runtime and toolchain:

- **Ultra-fast startup** — Bun's native JavaScript engine (JavaScriptCore) starts in milliseconds
- **Built-in TypeScript** — No separate `ts-node` or transpilation step needed for scripts
- **Drop-in compatibility** — Can run most Node.js packages directly
- **Fast test runner** — `bun test` with Jest-compatible API, zero config needed
- Both pnpm and Bun coexist — pnpm handles package management while Bun can execute scripts in dev

### 🎯 TanStack — Router, Query & Start

We chose **TanStack** (Router + Query + Start) as the full-stack framework backbone:

| Package | Purpose |
|---|---|
| `@tanstack/react-router` | Type-safe, file-based routing with search params, loaders, and code splitting |
| `@tanstack/react-query` | Async state management, caching, background refetching |
| `@tanstack/react-start` | SSR framework built on Vite + Nitro — server functions, middleware, streaming |

**Why TanStack over Next.js?**

- **End-to-end type safety** — Routes, params, and search params are fully typed at compile time
- **Fine-grained loading states** — Suspense boundaries and pending states are first-class
- **Server functions** — `createServerFn` co-locates server logic with client components, zero boilerplate
- **No framework lock-in** — TanStack libraries are adapter-agnostic; swap Nitro for any runtime

### ⚡ Vite — Build Tool

**Vite** powers our development and production builds:

- **Instant HMR** — Hot Module Replacement in < 50ms via native ESM, no full rebuilds
- **Rolldown bundler** — Production builds using the Rust-based Rolldown for maximum throughput
- **Plugin ecosystem** — `@vitejs/plugin-react`, `@tailwindcss/vite` integrate seamlessly
- **Env injection** — `VITE_*` variables are safely inlined at build time for the client bundle
- **SSR support** — Dual builds (client + SSR) are handled natively, powering TanStack Start

### 💅 Prettier — Code Formatter

**Prettier** enforces a consistent code style across the entire codebase:

- **Zero-debate formatting** — No style arguments; Prettier decides, everyone follows
- **Editor integration** — Format-on-save in VS Code with the included config
- **Pre-commit friendly** — Can be wired into `lint-staged` to auto-format before commits
- **ESLint integration** — `eslint-plugin-prettier` surfaces formatting issues as lint errors

---

## 🔥 Firebase Integration

| Service | Usage |
|---|---|
| **Firebase Auth** | Email/password, Google OAuth, Phone OTP (RecaptchaVerifier) |
| **Realtime Database** | Live issue sync — `onValue` listeners push updates to all clients instantly |
| **Security Rules** | Database rules in `firebase.database.rules.json` protect all write operations |

> **Note on API Keys:** Firebase client-side API keys are **public by design** — they identify your project, not authorize access. Security is enforced via Firebase Security Rules on the backend. Never confuse Firebase API keys with secret server credentials.

---

## 🗂️ Project Structure

```
src/
├── routes/                   # File-based TanStack Router pages
│   ├── __root.tsx            # Root layout, providers, SessionGate
│   ├── index.tsx             # Home map + complaint list
│   ├── raise.tsx             # New complaint form
│   ├── explore.tsx           # Browse/filter view
│   └── auth.tsx              # Login/register/phone OTP
├── components/               # Shared UI components
│   ├── ui/                   # shadcn/ui primitives (Radix-based)
│   ├── auth-context.tsx      # Firebase Auth React context
│   ├── language-context.tsx  # i18n reactive context
│   ├── issue-map.tsx         # Leaflet map wrapper (ClientOnly)
│   └── site-header.tsx       # Navigation header
├── lib/
│   ├── firebase.ts           # All Firebase calls (auth, DB, CRUD)
│   ├── i18n.ts               # Translation dictionary
│   ├── mock-data.ts          # Type definitions + seed data
│   └── location-resolver.ts  # Geocoding + state/district lookup
├── server.ts                 # SSR error boundary wrapper
└── start.ts                  # TanStack Start entry + CSRF middleware
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [pnpm](https://pnpm.io/installation): `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/UMDhodi/Bolo.git
cd Bolo

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase project credentials
```

### Environment Variables

Create a `.env.local` file in the root (this file is gitignored):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_APP_ID=1:xxxxx:web:xxxxx
```

### Development

```bash
pnpm dev         # Start Vite dev server with HMR
```

### Production Build

```bash
pnpm build       # Builds with Nitro (Vercel preset)
pnpm preview     # Preview production build locally
```

---

## 🌐 Deployment

The project deploys on **Vercel** using Nitro's `vercel` preset:

```ts
// vite.config.ts
export default defineConfig({
  nitro: { preset: "vercel" },  // Generates .vercel/output/ for serverless functions
});
```

### Steps to deploy

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Add all `VITE_FIREBASE_*` environment variables in **Vercel → Settings → Environment Variables**
3. Deploy — Vercel auto-runs `pnpm build` on every push to `main`

---

## 🛡️ Firebase Security Rules

Database rules live in [`firebase.database.rules.json`](./firebase.database.rules.json):

- **Issues** — Any authenticated user can read; only issue owners can update/delete their own
- **Users** — Each user can only read/write their own profile (`/users/$uid`)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with a clear message: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

Please run `pnpm lint` and `pnpm format` before submitting.

---

## 📄 License

MIT © [UMDhodi](https://github.com/UMDhodi)

---

<div align="center">

**Built with ❤️ for civic engagement in India**

*Bolo means "Speak" in Hindi — because every civic issue deserves a voice.*

</div>
