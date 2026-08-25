import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  push,
  update,
  remove,
  onValue,
  get,
  query,
  orderByChild,
  equalTo,
  goOffline,
  goOnline,
} from "firebase/database";
import { type Issue } from "./mock-data";
import { resolveLocationCoordinates } from "./location-resolver";
import { sanitizeInput, validateStrongPassword, hashPassword, verifyPasswordHash } from "./utils";
import { logSecurityEvent } from "./security-logger";

export type BoloUser = {
  uid: string;
  displayName: string;
  email: string | null;
  phone?: string | null;
  emailVerified?: boolean;
};

export type UserProfile = {
  uid: string;
  displayName: string;
  legalName?: string;
  email?: string | null;
  phone?: string | null;
  password?: string;
  role?: string;
  verified?: boolean;
  createdAt?: number;
};

export type NewIssue = {
  title: string;
  description: string;
  reporter: string;
  occurredAt: string;
  location: string;
  address: string;
  language: string;
  latitude: number | null;
  longitude: number | null;
  images: File[];
};

const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] || "AIzaSyCvxZOCzHIzVOpDYfffxnKUJmyZbdO6o-0",
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] || "bolo-civic-connect.firebaseapp.com",
  databaseURL: import.meta.env["VITE_FIREBASE_DATABASE_URL"] || "https://bolo-civic-connect-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] || "bolo-civic-connect",
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] || "bolo-civic-connect.firebasestorage.app",
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] || "1:68250444341:web:130a5209df8d13b92c877c",
};

export const isFirebaseConfigured = true;

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// ── Firebase Spark Tier Connection Optimizer (100 Concurrent Connections Cap) ──
// Automatically releases WebSocket connection when tab is hidden or idle
if (typeof window !== "undefined" && typeof document !== "undefined") {
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes of inactivity

  const handleActive = () => {
    try {
      goOnline(db);
    } catch {
      // ignore
    }
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (document.visibilityState === "hidden") {
        try {
          goOffline(db);
        } catch {
          // ignore
        }
      }
    }, IDLE_TIMEOUT_MS);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // Disconnect immediately on tab switch to preserve 100 connection pool
      try {
        goOffline(db);
      } catch {
        // ignore
      }
    } else {
      handleActive();
    }
  });

  window.addEventListener("focus", handleActive);
  window.addEventListener("mousemove", handleActive, { passive: true });
  window.addEventListener("keydown", handleActive, { passive: true });
  window.addEventListener("touchstart", handleActive, { passive: true });
}

export function subscribeToIssues(callback: (issues: Issue[]) => void): () => void {
  const issuesRef = ref(db, "issues");
  let isSubscribed = true;

  const parseIssues = (val: unknown): Issue[] => {
    if (!val || typeof val !== "object") return [];
    const list: Issue[] = Object.entries(val as Record<string, Issue>).map(([key, item]) => {
      return {
        ...item,
        id: item.id || key,
      };
    });
    list.sort((a, b) => (b.createdAt || new Date(b.date).getTime()) - (a.createdAt || new Date(a.date).getTime()));
    return list;
  };

  // 1. Direct REST fetch from Firebase Realtime Database endpoint
  fetch(`${firebaseConfig.databaseURL}/issues.json`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (isSubscribed && data) {
        callback(parseIssues(data));
      }
    })
    .catch((err) => {
      console.warn("Direct REST issues fetch notice:", err);
    });

  // 2. Realtime stream subscription via Firebase SDK
  const unsubscribe = onValue(
    issuesRef,
    (snapshot) => {
      if (!isSubscribed) return;
      if (snapshot.exists()) {
        callback(parseIssues(snapshot.val()));
      } else {
        callback([]);
      }
    },
    (error) => {
      console.warn("Firebase Realtime Database stream notice:", error);
    }
  );

  return () => {
    isSubscribed = false;
    unsubscribe();
  };
}

function message(error: unknown) {
  if (!(error instanceof Error)) return "Something went wrong. Please try again.";
  if (error.message.includes("auth/quota-exceeded")) return "Monthly service quota reached (Spark tier limit: 50,000 active users). Please try again later.";
  if (error.message.includes("auth/too-many-requests")) return "Too many requests. Please wait a moment before trying again.";
  if (error.message.includes("auth/email-already-in-use")) return "This email is already registered. Try signing in.";
  if (error.message.includes("auth/invalid-credential") || error.message.includes("auth/user-not-found") || error.message.includes("auth/wrong-password")) return "Email or password is incorrect.";
  if (error.message.includes("auth/weak-password")) return "Password must be at least 8 characters long with uppercase, lowercase, numbers, and special characters.";
  if (error.message.includes("auth/invalid-verification-code")) return "Invalid OTP code. Please check and try again.";
  if (error.message.includes("max-connections") || error.message.includes("connection-limit")) return "Server is experiencing high traffic (maximum 100 simultaneous users reached). Retrying...";
  return error.message.replace("Firebase: ", "");
}

export async function initiateSignupAndSendVerification(email: string, password: string) {
  const pwdValidation = validateStrongPassword(password);
  if (!pwdValidation.valid) {
    throw new Error(`Password security requirements not met: ${pwdValidation.errors.join(", ")}.`);
  }

  const cleanEmail = email.trim().toLowerCase();
  const hashedPassword = await hashPassword(password);
  let credential;

  try {
    credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  } catch (err: unknown) {
    const errStr = String(err);
    if (errStr.includes("email-already-in-use")) {
      credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    } else {
      throw err;
    }
  }

  if (credential && credential.user) {
    // 1. Send native Firebase email verification link immediately
    try {
      await sendEmailVerification(credential.user);
    } catch (mailErr) {
      console.warn("Could not send email verification link:", mailErr);
    }

    // 2. Persist initial user record in Realtime Database
    try {
      const userRef = ref(db, `users/${credential.user.uid}`);
      const snap = await get(userRef);
      const existing = snap.exists() ? (snap.val() as Record<string, unknown>) : {};
      await set(userRef, {
        ...existing,
        uid: credential.user.uid,
        email: cleanEmail,
        password: hashedPassword,
        role: "citizen",
        verified: false,
        createdAt: existing["createdAt"] || Date.now(),
      });
    } catch (dbErr) {
      console.warn("Could not save initial user record to Realtime Database:", dbErr);
    }

    return toBoloUser(credential.user);
  }

  throw new Error("Unable to create account.");
}

export async function saveCitizenProfile(input: {
  uid: string;
  displayName: string;
  legalName?: string;
  phone?: string;
  email?: string;
}): Promise<UserProfile> {
  const current = auth.currentUser;
  if (current && input.displayName) {
    try {
      await updateProfile(current, { displayName: input.displayName.trim() });
    } catch (e) {
      console.warn("Could not update auth displayName:", e);
    }
  }

  const cleanPhone = input.phone
    ? input.phone.startsWith("+91")
      ? input.phone
      : `+91${input.phone.replace(/\D/g, "")}`
    : "";

  const userRef = ref(db, `users/${input.uid}`);
  let existing: Record<string, unknown> = {};
  try {
    const snap = await get(userRef);
    if (snap.exists()) {
      existing = snap.val() as Record<string, unknown>;
    }
  } catch {
    // fallback
  }

  const profilePayload: UserProfile = {
    ...existing,
    uid: input.uid,
    displayName: input.displayName.trim(),
    legalName: (input.legalName || input.displayName).trim(),
    phone: cleanPhone || (existing["phone"] as string) || "",
    email: input.email || current?.email || (existing["email"] as string) || "",
    role: "citizen",
    verified: true,
    updatedAt: Date.now(),
  };

  await set(userRef, profilePayload);
  return profilePayload;
}

export async function createBoloAccount(input: {
  displayName: string;
  phone: string;
  email: string;
  password: string;
}) {
  return await saveCitizenProfile({
    uid: auth.currentUser?.uid || "",
    displayName: input.displayName,
    legalName: input.displayName,
    phone: input.phone,
    email: input.email,
  });
}

export async function resendVerificationEmail(): Promise<void> {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error("No active account session found. Please sign in to request a verification email.");
  }
}

export async function checkEmailVerified(): Promise<boolean> {
  if (auth.currentUser) {
    await auth.currentUser.reload();
    return auth.currentUser.emailVerified;
  }
  return false;
}

export async function sendPasswordResetLink(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }
  await sendPasswordResetEmail(auth, cleanEmail);
}

export async function updateUserPassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) {
    throw new Error("No active user session found. Please sign in.");
  }
  const pwdValidation = validateStrongPassword(newPassword);
  if (!pwdValidation.valid) {
    throw new Error(`Password requirement: ${pwdValidation.errors.join(", ")}.`);
  }

  // 1. Direct Firebase Auth password update (no verification link required)
  await updatePassword(auth.currentUser, newPassword);

  // 2. Encrypt and store password hash in Realtime Database under users/${uid}
  const hashedPassword = await hashPassword(newPassword);
  try {
    await update(ref(db, `users/${auth.currentUser.uid}`), {
      password: hashedPassword,
    });
  } catch (dbErr) {
    console.warn("Could not sync updated password hash to Realtime Database:", dbErr);
  }
}

export async function signInToBolo(email: string, password: string) {
  const cleanEmail = email.trim().toLowerCase();
  const hashedPassword = await hashPassword(password);

  try {
    const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    // Ensure encrypted password hash and email are updated in RTDB
    try {
      await update(ref(db, `users/${credential.user.uid}`), {
        password: hashedPassword,
        email: cleanEmail,
      });
    } catch {
      // ignore
    }
    return toBoloUser(credential.user);
  } catch (err: unknown) {
    // If standard Auth fails, check if user exists in RTDB by email with matching encrypted password
    try {
      const userQuery = query(ref(db, "users"), orderByChild("email"), equalTo(cleanEmail));
      const snap = await get(userQuery);
      if (snap.exists()) {
        const records = Object.values(snap.val() as Record<string, UserProfile>);
        const matched = records.find((u) => u.password === hashedPassword || (u.email && u.email.toLowerCase() === cleanEmail));
        if (matched && matched.password === hashedPassword) {
          if (auth.currentUser && auth.currentUser.uid === matched.uid) {
            return toBoloUser(auth.currentUser);
          }
          // Authenticate session
          try {
            const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
            return toBoloUser(newCred.user);
          } catch {
            // ignore
          }
        }
      }
    } catch (lookupErr) {
      console.warn("Password lookup notice:", lookupErr);
    }
    throw err;
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  try {
    const userRef = ref(db, `users/${credential.user.uid}`);
    const snap = await get(userRef);
    if (snap.exists()) {
      // Existing user: Preserve their customized name, phone, and profile details!
      const existingData = snap.val() as UserProfile;
      if (existingData.displayName && existingData.displayName !== credential.user.displayName) {
        await updateProfile(credential.user, { displayName: existingData.displayName });
      }
      await update(userRef, {
        verified: existingData.verified ?? true,
        email: existingData.email || credential.user.email,
      });
    } else {
      // Check if an existing account exists by matching email
      let existingByEmail: UserProfile | null | undefined = null;
      if (credential.user.email) {
        try {
          const userQuery = query(ref(db, "users"), orderByChild("email"), equalTo(credential.user.email));
          const emailSnap = await get(userQuery);
          if (emailSnap.exists()) {
            const list = Object.values(emailSnap.val() as Record<string, UserProfile>);
            if (list.length > 0 && list[0]) existingByEmail = list[0];
          }
        } catch (e) {
          console.warn("Could not check existing user by email:", e);
        }
      }

      const finalDisplayName = existingByEmail?.displayName || credential.user.displayName || "Bolo citizen";
      if (existingByEmail?.displayName && credential.user) {
        await updateProfile(credential.user, { displayName: existingByEmail.displayName });
      }

      await set(userRef, {
        uid: credential.user.uid,
        displayName: finalDisplayName,
        legalName: existingByEmail?.legalName || "",
        email: credential.user.email,
        phone: existingByEmail?.phone || credential.user.phoneNumber || "",
        role: existingByEmail?.role || "citizen",
        verified: true,
        createdAt: existingByEmail?.createdAt || Date.now(),
      });
    }
  } catch (dbErr) {
    console.warn("Could not save Google user profile to Realtime Database:", dbErr);
  }
  return toBoloUser(credential.user);
}

export { RecaptchaVerifier, type ConfirmationResult };

export function createRecaptchaVerifier(containerId: string) {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
}

export async function sendPhoneOTP(phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

export async function verifyPhoneOTP(confirmationResult: ConfirmationResult, code: string, displayName?: string) {
  const credential = await confirmationResult.confirm(code);
  if (displayName && credential.user) {
    await updateProfile(credential.user, { displayName });
  }
  try {
    if (credential.user) {
      await set(ref(db, `users/${credential.user.uid}`), {
        uid: credential.user.uid,
        displayName: displayName || credential.user.displayName || "Bolo citizen",
        phone: credential.user.phoneNumber || "",
        role: "citizen",
        createdAt: Date.now(),
      });
    }
  } catch (dbErr) {
    console.warn("Could not save phone user profile to Realtime Database:", dbErr);
  }
  return toBoloUser(credential.user);
}

export async function checkUserExistsByPhone(phoneNumber: string): Promise<UserProfile | null> {
  const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber.replace(/\D/g, "")}`;
  try {
    const userQuery = query(ref(db, "users"), orderByChild("phone"), equalTo(formattedPhone));
    const snap = await get(userQuery);
    if (snap.exists()) {
      const records = Object.values(snap.val() as Record<string, UserProfile>);
      if (records.length > 0 && records[0]) return records[0];
    }
  } catch (err) {
    console.warn("Could not query user by phone:", err);
  }
  return null;
}

export async function loginOrCreatePhoneUser(input: {
  phone: string;
  displayName?: string;
  email?: string;
}) {
  const cleanDigits = input.phone.replace(/\D/g, "");
  const formattedPhone = `+91${cleanDigits.length === 10 ? cleanDigits : cleanDigits.slice(-10)}`;
  const finalName = sanitizeInput(input.displayName || "Bolo Citizen");
  const finalEmail = sanitizeInput(input.email || "");

  // Use a secure synthetic auth account for phone-verified users
  const syntheticEmail = finalEmail && finalEmail.includes("@") ? finalEmail : `p${cleanDigits}@bolo.internal`;
  const syntheticPassword = `Bolo#Phone_${cleanDigits}!91`;

  let currentUser: User | null = auth.currentUser;

  if (!currentUser || currentUser.email !== syntheticEmail) {
    try {
      // Try signing in first
      const cred = await signInWithEmailAndPassword(auth, syntheticEmail, syntheticPassword);
      currentUser = cred.user;
    } catch {
      try {
        // If account does not exist, create it
        const newCred = await createUserWithEmailAndPassword(auth, syntheticEmail, syntheticPassword);
        currentUser = newCred.user;
      } catch (createErr) {
        // If already in use with user's email, try signing in or fallback to phone synthetic email
        const fallbackEmail = `p${cleanDigits}@bolo.internal`;
        try {
          const fallbackCred = await signInWithEmailAndPassword(auth, fallbackEmail, syntheticPassword);
          currentUser = fallbackCred.user;
        } catch {
          const fallbackNew = await createUserWithEmailAndPassword(auth, fallbackEmail, syntheticPassword);
          currentUser = fallbackNew.user;
        }
      }
    }
  }

  if (currentUser && finalName) {
    try {
      await updateProfile(currentUser, { displayName: finalName });
    } catch {
      // ignore
    }
  }

  // Save profile in users/${currentUser.uid}
  if (currentUser) {
    try {
      const hashedSynthetic = await hashPassword(syntheticPassword);
      const userRef = ref(db, `users/${currentUser.uid}`);
      await set(userRef, {
        uid: currentUser.uid,
        displayName: finalName,
        phone: formattedPhone,
        email: finalEmail || currentUser.email || "",
        password: hashedSynthetic,
        role: "citizen",
        verified: true,
        createdAt: Date.now(),
      });
    } catch (err) {
      console.warn("Could not save phone user profile in RTDB:", err);
    }
    return toBoloUser(currentUser);
  }

  throw new Error("Unable to create phone user session.");
}

export async function signOutOfBolo() {
  await signOut(auth);
}

export function observeBoloAuth(callback: (user: BoloUser | null) => void) {
  return onAuthStateChanged(auth, (user: User | null) => callback(user ? toBoloUser(user) : null));
}

// ── File Upload Security: Magic Byte & Extension Verification ──────────────
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file limit

async function validateImageMagicBytes(file: File): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 4) return false;

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
    // PNG: 89 50 4E 47
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true;
    // WebP / RIFF: 52 49 46 46
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return true;
    // GIF: 47 49 46 38
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true;

    return false;
  } catch {
    return false;
  }
}

async function compressImageToBase64(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  // 1. File Size Verification (CWE-400 / Resource Exhaustion)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds maximum allowed size (10 MB).");
  }

  // 2. MIME Type Validation
  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    throw new Error("Invalid file format. Only JPG, PNG, and WebP images are permitted.");
  }

  // 3. File Signature / Magic Byte Header Verification
  const isValidSignature = await validateImageMagicBytes(file);
  if (!isValidSignature) {
    throw new Error("File content does not match genuine image signature.");
  }

  // 4. Image Re-Encoding via Canvas (Strips all malicious EXIF, embedded scripts, and polyglots)
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);

      // Anti-Image Decompression Bomb (Pixel Flood DoS protection)
      if (img.naturalWidth > 8192 || img.naturalHeight > 8192) {
        reject(new Error("Image dimensions exceed the safety limit (8192x8192)."));
        return;
      }

      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } else {
        reject(new Error("Unable to create canvas context for image re-encoding."));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image file."));
    };
    img.src = url;
  });
}

export async function submitIssue(user: BoloUser, issue: NewIssue): Promise<string> {
  const newRef = push(ref(db, "issues"));
  const issueId = newRef.key || `BLO-${Date.now()}`;

  const imageUrls: string[] = [];
  for (const file of issue.images) {
    if (!file) continue;
    try {
      const base64Str = await compressImageToBase64(file);
      imageUrls.push(base64Str);
    } catch (err) {
      console.warn("Error compressing image to base64:", err);
    }
  }

  if (imageUrls.length === 0) {
    imageUrls.push(
      "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22450%22%20viewBox%3D%220%200%20600%20450%22%3E%3Crect%20width%3D%22600%22%20height%3D%22450%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%3ENo%20Image%20Uploaded%3C%2Ftext%3E%3C%2Fsvg%3E"
    );
  }

  // Accurate instant location resolution
  const manualCoords =
    issue.latitude && issue.longitude
      ? { latitude: issue.latitude, longitude: issue.longitude }
      : null;
  const resolved = resolveLocationCoordinates(issue.location, issue.address, manualCoords);

  const dateParts = issue.occurredAt ? issue.occurredAt.split("T") : [];
  const dateStr: string =
    (dateParts.length > 0 && dateParts[0] ? dateParts[0] : "") ||
    new Date().toISOString().slice(0, 10);

  const fullIssueData: Issue = {
    id: issueId,
    title: sanitizeInput(issue.title, 150),
    description: sanitizeInput(issue.description, 4000),
    reporter: sanitizeInput(issue.reporter, 100) || user.displayName,
    reporterUid: user.uid,
    userId: user.uid,
    reporterEmail: user.email ?? null,
    reporterPhone: user.phone ?? null,
    createdAt: Date.now(),
    date: dateStr,
    status: "reported",
    category: sanitizeInput(issue.language, 50) || "Civic Issue",
    location: sanitizeInput(issue.location, 200),
    address: sanitizeInput(issue.address, 300),
    images: imageUrls,
    state: resolved.state,
    district: resolved.district,
    city: resolved.city,
    lat: resolved.latitude,
    lng: resolved.longitude,
  };

  try {
    await set(ref(db, `issues/${issueId}`), fullIssueData);
  } catch (err) {
    console.warn("Error setting issue in Realtime Database:", err);
  }

  return issueId;
}

export async function updateIssue(
  issueId: string,
  updates: Partial<Omit<Issue, "id">> & { newImages?: File[] }
): Promise<void> {
  const issueRef = ref(db, `issues/${issueId}`);
  const snap = await get(issueRef);
  if (!snap.exists()) {
    throw new Error("Issue not found in database.");
  }
  const existing = snap.val() as Issue;

  // Authorization & Resource Ownership Check (Prevent IDOR / Horizontal Privilege Escalation)
  const currentUid = auth.currentUser?.uid;
  if (currentUid && existing.reporterUid && existing.reporterUid !== currentUid && existing.userId !== currentUid) {
    logSecurityEvent({
      eventType: "AUTHORIZATION_FAILURE",
      action: "UPDATE_ISSUE_ATTEMPT",
      uid: currentUid,
      targetId: issueId,
      details: { reporterUid: existing.reporterUid },
    });
    throw new Error("Unauthorized: You do not have permission to modify this issue.");
  }

  let finalImages = updates.images ?? existing.images;
  if (updates.newImages && updates.newImages.length > 0) {
    const newBase64s: string[] = [];
    for (const file of updates.newImages) {
      try {
        const b64 = await compressImageToBase64(file);
        newBase64s.push(b64);
      } catch (e) {
        console.warn("Error compressing image:", e);
      }
    }
    if (newBase64s.length > 0) {
      finalImages = [...finalImages, ...newBase64s].slice(0, 5);
    }
  }

  // Re-resolve location if location or address was updated
  let resolvedLat = updates.lat ?? existing.lat;
  let resolvedLng = updates.lng ?? existing.lng;
  let resolvedState = updates.state ?? existing.state;
  let resolvedDistrict = updates.district ?? existing.district;
  let resolvedCity = updates.city ?? existing.city;

  if (
    (updates.location && updates.location !== existing.location) ||
    (updates.address && updates.address !== existing.address)
  ) {
    const loc = updates.location ?? existing.location;
    const addr = updates.address ?? existing.address;
    const resolved = resolveLocationCoordinates(loc, addr, null);
    resolvedLat = resolved.latitude;
    resolvedLng = resolved.longitude;
    resolvedState = resolved.state;
    resolvedDistrict = resolved.district;
    resolvedCity = resolved.city;
  }

  // Strict Schema Whitelisting & Input Sanitization (Mitigate Mass Assignment - OWASP API3:2023)
  const safePayload: Partial<Issue> = {
    title: updates.title !== undefined ? sanitizeInput(updates.title, 150) : existing.title,
    description: updates.description !== undefined ? sanitizeInput(updates.description, 4000) : existing.description,
    location: updates.location !== undefined ? sanitizeInput(updates.location, 200) : existing.location,
    address: updates.address !== undefined ? sanitizeInput(updates.address, 300) : existing.address,
    category: updates.category !== undefined ? sanitizeInput(updates.category, 50) : existing.category,
    images: finalImages,
    lat: resolvedLat,
    lng: resolvedLng,
    state: resolvedState,
    district: resolvedDistrict,
    city: resolvedCity,
  };

  await update(issueRef, safePayload);
}

export async function deleteIssue(issueId: string): Promise<void> {
  const issueRef = ref(db, `issues/${issueId}`);
  const snap = await get(issueRef);
  if (snap.exists()) {
    const existing = snap.val() as Issue;
    const currentUid = auth.currentUser?.uid;
    if (currentUid && existing.reporterUid && existing.reporterUid !== currentUid && existing.userId !== currentUid) {
      logSecurityEvent({
        eventType: "AUTHORIZATION_FAILURE",
        action: "DELETE_ISSUE_ATTEMPT",
        uid: currentUid,
        targetId: issueId,
      });
      throw new Error("Unauthorized: You do not have permission to delete this issue.");
    }
  }
  await remove(issueRef);
}

export function getFirebaseErrorMessage(error: unknown) {
  return message(error);
}

function toBoloUser(user: User): BoloUser {
  return {
    uid: user.uid,
    displayName: user.displayName || "Bolo citizen",
    email: user.email ?? null,
    phone: user.phoneNumber ?? null,
    emailVerified: user.emailVerified,
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await get(ref(db, `users/${uid}`));
    if (snap.exists()) {
      const data = snap.val() as UserProfile;
      return {
        ...data,
        displayName: data.displayName || auth.currentUser?.displayName || "Bolo citizen",
        legalName: data.legalName || data.displayName || auth.currentUser?.displayName || "Bolo citizen",
        email: data.email || auth.currentUser?.email || null,
        phone: data.phone || auth.currentUser?.phoneNumber || null,
      };
    }
    if (auth.currentUser && auth.currentUser.uid === uid) {
      return {
        uid,
        displayName: auth.currentUser.displayName || "Bolo citizen",
        legalName: auth.currentUser.displayName || "Bolo citizen",
        email: auth.currentUser.email || null,
        phone: auth.currentUser.phoneNumber || null,
        verified: auth.currentUser.emailVerified,
      };
    }
    return null;
  } catch {
    if (auth.currentUser && auth.currentUser.uid === uid) {
      return {
        uid,
        displayName: auth.currentUser.displayName || "Bolo citizen",
        legalName: auth.currentUser.displayName || "Bolo citizen",
        email: auth.currentUser.email || null,
        phone: auth.currentUser.phoneNumber || null,
        verified: auth.currentUser.emailVerified,
      };
    }
    return null;
  }
}

export async function updateUserProfile(
  uid: string,
  fields: { displayName?: string | undefined; legalName?: string | undefined; phone?: string | undefined },
): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (currentUid && currentUid !== uid) {
    logSecurityEvent({
      eventType: "AUTHORIZATION_FAILURE",
      action: "MODIFY_USER_PROFILE_ATTEMPT",
      uid: currentUid,
      targetId: uid,
    });
    throw new Error("Unauthorized: You can only modify your own profile.");
  }
  const snap = await get(ref(db, `users/${uid}`));
  const existing = snap.exists() ? (snap.val() as UserProfile) : {};
  await set(ref(db, `users/${uid}`), { ...existing, ...fields, uid });
  const currentUser = auth.currentUser;
  if (currentUser && fields.displayName) {
    await updateProfile(currentUser, { displayName: fields.displayName });
  }
}

export async function getUserIssueCount(
  uid: string,
  userDisplayName?: string | null,
  userEmail?: string | null
): Promise<number> {
  try {
    const snap = await get(ref(db, "issues"));
    if (!snap.exists()) return 0;
    const issues = Object.values(snap.val() as Record<string, Issue>);
    const nameNorm = userDisplayName?.trim().toLowerCase();
    const emailNorm = userEmail?.trim().toLowerCase();
    const emailPrefix = emailNorm ? emailNorm.split("@")[0] : null;

    return issues.filter((i) => {
      if (i.reporterUid && i.reporterUid === uid) return true;
      if (i.userId && i.userId === uid) return true;
      if (emailNorm && i.reporterEmail && i.reporterEmail.toLowerCase() === emailNorm) return true;
      if (nameNorm && i.reporter && i.reporter.trim().toLowerCase() === nameNorm) return true;
      if (emailPrefix && i.reporter && i.reporter.trim().toLowerCase() === emailPrefix) return true;
      return false;
    }).length;
  } catch {
    return 0;
  }
}

/**
 * Privacy & Compliance: Data Export (GDPR / DPDP Article 20)
 * Exports the complete user profile and reported issues.
 */
export async function exportUserData(uid: string): Promise<{ profile: UserProfile | null; issues: Issue[] }> {
  const profile = await getUserProfile(uid);
  let userIssues: Issue[] = [];
  try {
    const snap = await get(ref(db, "issues"));
    if (snap.exists()) {
      const allIssues = Object.values(snap.val() as Record<string, Issue>);
      userIssues = allIssues.filter((i) => i.reporterUid === uid || i.userId === uid);
    }
  } catch {
    // Continue with empty issues list
  }
  return { profile, issues: userIssues };
}

/**
 * Privacy & Compliance: Right to Erasure / Account Deletion (GDPR / DPDP Article 17)
 * Permanently purges user profile data and terminates authentication account.
 */
export async function deleteUserAccount(uid: string): Promise<void> {
  const current = auth.currentUser;
  if (!current || current.uid !== uid) {
    throw new Error("Unauthorized: You can only delete your own account.");
  }

  logSecurityEvent({
    eventType: "PERMISSION_CHANGE",
    action: "DELETE_USER_ACCOUNT",
    uid,
  });

  // 1. Delete user profile record from Realtime Database
  try {
    await remove(ref(db, `users/${uid}`));
  } catch (err) {
    console.warn("Could not delete user database record:", err);
  }

  // 2. Clear session cookie
  if (typeof document !== "undefined") {
    document.cookie = "bolo_session=; Path=/; Max-Age=0; SameSite=Lax";
  }

  // 3. Delete the user authentication record from Firebase Auth
  await deleteUser(current);
}


