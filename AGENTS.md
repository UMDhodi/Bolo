<!-- CODEX:BEGIN -->
# Bolo Civic Connect — AI Agent Guidelines

> [!NOTE]
> This project is crafted and maintained with **OpenAI & Codex**.
> Follow modern React, TypeScript, Vite, TailwindCSS, and TanStack Router patterns.

### Development Standards
- All civic complaint data is synced with Firebase Realtime Database.
- Multilingual translations are managed in `src/lib/i18n.ts` using the reactive `useT()` hook.
- All interactive overlays and dialogs use high z-index isolation to coexist with Leaflet maps.

---

### Continuous Security & Penetration Testing Requirements
> [!IMPORTANT]
> **Mandatory Security Policy:**
> Every feature, endpoint, page, API, component, and database operation must automatically undergo continuous security verification before and after any code modification.
>
> **Continuous Verification Gates:**
> 1. **Static Application Security Testing (SAST):** Strict TypeScript compilation, zero `eval()`, zero unescaped `innerHTML`, and strict ESLint conformance.
> 2. **Dynamic Application Security Testing (DAST) & Injection Prevention:**
>    - Parameterized NoSQL queries; rejection of operator injection.
>    - Contextual JSX output escaping; elimination of XSS sinks.
>    - SSRF prevention via `isSafeExternalUrl()` (blocking loopback, private RFC 1918 IPs, and cloud metadata `169.254.169.254`).
>    - Anti-decompression bomb protection ($8192 \times 8192$ px max) and file magic byte inspection (`validateImageMagicBytes`).
> 3. **Authentication & Authorization (OWASP ASVS V2 & V4):**
>    - Strong password complexity policy (8+ chars, uppercase, lowercase, digits, special characters).
>    - IDOR / Horizontal privilege escalation guards on all state mutations (`updateIssue`, `deleteIssue`, `updateUserProfile`).
> 4. **API Security & Mass Assignment (OWASP API3:2023):**
>    - Explicit payload whitelisting and input sanitization (`sanitizeInput()`).
> 5. **Security Headers & Network Transport:**
>    - Strict Content-Security-Policy (CSP), HSTS preloading, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `Permissions-Policy` enforced on all responses in `src/server.ts`.
>    - Automatic HTTP → HTTPS 301 redirection.
> 6. **Secret Management & Logging:**
>    - Zero secrets/private keys in repositories, bundles, or cookies.
>    - Structured logging via `logSecurityEvent()` with automatic PII masking and secret redaction.
> 7. **Privacy & Regulatory Compliance (GDPR / DPDP):**
>    - Built-in data export (`exportUserData()`) and permanent account erasure (`deleteUserAccount()`).
>
> *Rule: When uncertain, always choose the more secure implementation over the more convenient one.*

---

### Firebase Spark Plan Resource Limits & Connection Optimization
> [!NOTE]
> **Plan Tier:** Firebase Spark (Free Tier)
> - **Authentication (MAUs):** 50,000 Monthly Active Users (managed natively by Firebase Auth).
> - **Realtime Database Simultaneous Connections:** Max 100 concurrent WebSocket connections.
> 
> **Connection Pooling Strategy in `src/lib/firebase.ts`:**
> - Inactivity/background tab optimizer: Calls `goOffline(db)` on `visibilitychange: hidden` or after 3 minutes idle.
> - Auto-reconnect: Calls `goOnline(db)` on tab focus, touch, or mouse movement to preserve the 100 concurrent connection pool.
> - Quota error guards: Explicit error messaging for `auth/quota-exceeded` and `max-connections` with automated redirection to `/waitlist`.

---

### Firebase Phone OTP Authentication (Disabled for Spark Plan)
> [!IMPORTANT]
> **Status:** Phone OTP is temporarily commented out in the UI because Firebase SMS requires the **Blaze (Pay-as-you-go) Plan** and configured SMS Region policy for India (+91).
> 
> **Files involved:**
> - [src/routes/auth.tsx](file:///c:/Users/mayan/OneDrive/Desktop/Hackthon/Bolo%20Civic%20Connect/src/routes/auth.tsx): Contains the commented-out `phone` mode, `handleSendOTP()`, `handleVerifyOTP()`, and the Phone tab UI.
> - [src/lib/firebase.ts](file:///c:/Users/mayan/OneDrive/Desktop/Hackthon/Bolo%20Civic%20Connect/src/lib/firebase.ts): Contains the active underlying helper functions `createRecaptchaVerifier()`, `sendPhoneOTP()`, and `verifyPhoneOTP()`.
> 
> **How to Re-Enable when on Blaze Plan:**
> 1. In Firebase Console → Authentication → Sign-in method → Ensure **Phone** is Enabled and **SMS Region Policy** allows India (+91).
> 2. In `src/routes/auth.tsx`:
>    - Set `type Mode = "signup" | "signin" | "phone";`
>    - Uncomment the Phone state & handlers (`otpSent`, `handleSendOTP`, `handleVerifyOTP`).
>    - Uncomment the Phone tab in the tab switcher (change `grid-cols-2` to `grid-cols-3`).
>    - Uncomment the Phone form section in `submit()` and the JSX form body.

<!-- CODEX:TAGS: openai, codex, react, typescript, vite, tanstack-router, tailwindcss, firebase, leaflet, phone-otp, security-hardened -->
<!-- CODEX:END -->
