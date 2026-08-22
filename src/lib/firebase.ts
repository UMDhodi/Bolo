import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
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
} from "firebase/database";
import { SEED_ISSUES, type Issue } from "./mock-data";
import { resolveLocationCoordinates } from "./location-resolver";

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
  role?: string;
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
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] || "AIzaSyBoloCivicConnectDemoKeyDummy123",
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] || "bolo-civic-connect.firebaseapp.com",
  databaseURL: import.meta.env["VITE_FIREBASE_DATABASE_URL"] || "https://bolo-civic-connect-default-rtdb.firebaseio.com",
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] || "bolo-civic-connect",
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] || "bolo-civic-connect.appspot.com",
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] || "1:1234567890:web:abcdef123456",
};

export const isFirebaseConfigured = true;

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export function subscribeToIssues(callback: (issues: Issue[]) => void): () => void {
  callback([]);

  const issuesRef = ref(db, "issues");
  const unsubscribe = onValue(
    issuesRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: Issue[] = Object.values(val);
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        callback(list);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.warn("Firebase Realtime Database read notice:", error);
      callback([]);
    }
  );

  return unsubscribe;
}

function message(error: unknown) {
  if (!(error instanceof Error)) return "Something went wrong. Please try again.";
  if (error.message.includes("auth/email-already-in-use")) return "This email is already registered. Try signing in.";
  if (error.message.includes("auth/invalid-credential") || error.message.includes("auth/user-not-found") || error.message.includes("auth/wrong-password")) return "Email or password is incorrect.";
  if (error.message.includes("auth/weak-password")) return "Choose a password with at least 6 characters.";
  if (error.message.includes("auth/invalid-verification-code")) return "Invalid OTP code. Please check and try again.";
  return error.message.replace("Firebase: ", "");
}

export async function createBoloAccount(input: {
  displayName: string;
  phone: string;
  email: string;
  password: string;
}) {
  const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
  await updateProfile(credential.user, { displayName: input.displayName });
  try {
    await set(ref(db, `users/${credential.user.uid}`), {
      uid: credential.user.uid,
      displayName: input.displayName,
      phone: input.phone,
      email: input.email,
      role: "citizen",
      createdAt: Date.now(),
    });
  } catch (dbErr) {
    console.warn("Could not save user profile to Realtime Database:", dbErr);
  }
  return toBoloUser(credential.user);
}

export async function signInToBolo(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return toBoloUser(credential.user);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  try {
    await set(ref(db, `users/${credential.user.uid}`), {
      uid: credential.user.uid,
      displayName: credential.user.displayName || "Bolo citizen",
      email: credential.user.email,
      phone: credential.user.phoneNumber || "",
      role: "citizen",
      createdAt: Date.now(),
    });
  } catch (dbErr) {
    console.warn("Could not save Google user profile to Realtime Database:", dbErr);
  }
  return toBoloUser(credential.user);
}

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

export async function signOutOfBolo() {
  await signOut(auth);
}

export function observeBoloAuth(callback: (user: BoloUser | null) => void) {
  return onAuthStateChanged(auth, (user: User | null) => callback(user ? toBoloUser(user) : null));
}

async function compressImageToBase64(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
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
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    img.onerror = () => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
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
    title: issue.title.trim(),
    description: issue.description.trim(),
    reporter: issue.reporter.trim() || user.displayName,
    reporterUid: user.uid,
    userId: user.uid,
    reporterEmail: user.email ?? null,
    reporterPhone: user.phone ?? null,
    createdAt: Date.now(),
    date: dateStr,
    status: "reported",
    category: "Civic Issue",
    location: issue.location.trim(),
    address: issue.address.trim(),
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

  const payload: Partial<Issue> = {
    ...updates,
    images: finalImages,
    lat: resolvedLat,
    lng: resolvedLng,
    state: resolvedState,
    district: resolvedDistrict,
    city: resolvedCity,
  };
  delete (payload as { newImages?: unknown }).newImages;

  await update(issueRef, payload);
}

export async function deleteIssue(issueId: string): Promise<void> {
  const issueRef = ref(db, `issues/${issueId}`);
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
    if (snap.exists()) return snap.val() as UserProfile;
    return null;
  } catch {
    return null;
  }
}

export async function updateUserProfile(
  uid: string,
  fields: { displayName?: string | undefined; legalName?: string | undefined; phone?: string | undefined },
): Promise<void> {
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


