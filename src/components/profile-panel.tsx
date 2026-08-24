import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  CircleAlert,
  Copy,
  Check,
  Download,
  Edit2,
  HelpCircle,
  LifeBuoy,
  LogOut,
  Save,
  ScrollText,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SpinnerToCheck from "@/components/loader";
import { useAuth } from "@/components/auth-context";
import { useT } from "@/components/language-context";
import {
  getUserProfile,
  getUserIssueCount,
  updateUserProfile,
  exportUserData,
  deleteUserAccount,
  getFirebaseErrorMessage,
  signOutOfBolo,
  type UserProfile,
} from "@/lib/firebase";

// ── Avatar initials helper ──────────────────────────────────────────────────
export function avatarInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

// ── Colour palette picked from display name hash ───────────────────────────
const AVATAR_COLORS = [
  ["#7c3aed", "#ede9fe"],
  ["#0ea5e9", "#e0f2fe"],
  ["#10b981", "#d1fae5"],
  ["#f59e0b", "#fef3c7"],
  ["#ef4444", "#fee2e2"],
  ["#ec4899", "#fce7f3"],
];
function avatarColor(name: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return (AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? ["#7c3aed", "#ede9fe"]) as [string, string];
}

// ── Stat KPI Card ───────────────────────────────────────────────────────────
function KpiCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-secondary/50 p-4 text-center">
      <span className="text-3xl font-bold text-primary tabular-nums">
        {value === null ? "—" : value}
      </span>
      <span className="mt-1 text-xs font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}

// ── Read-only field row ─────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground break-all">
        {value || <span className="text-muted-foreground italic">—</span>}
      </span>
    </div>
  );
}

// ── Editable text field ─────────────────────────────────────────────────────
function EditField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

// ── Main ProfilePanel (Dropdown Menu matching design + Dialog for Details) ──
export function ProfilePanel({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const t = useT();

  // Modals state
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [tosDialogOpen, setTosDialogOpen] = useState(false);

  // Profile data state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [issueCount, setIssueCount] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editLegal, setEditLegal] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const fetchedRef = useRef(false);

  // Fetch profile + KPI when profile dialog opens
  useEffect(() => {
    if (!user) return;
    void (async () => {
      const prof = await getUserProfile(user.uid);
      const count = await getUserIssueCount(
        user.uid,
        prof?.displayName ?? user.displayName,
        prof?.email ?? user.email
      );
      setProfile(prof);
      setIssueCount(count);
    })();
  }, [user, profileDialogOpen]);

  function startEdit() {
    setEditName(profile?.displayName ?? user?.displayName ?? "");
    setEditLegal(profile?.legalName ?? "");
    setEditPhone(profile?.phone ?? user?.phone ?? "");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: editName.trim() || undefined,
        legalName: editLegal.trim() || undefined,
        phone: editPhone.trim() || undefined,
      });
      const updated = await getUserProfile(user.uid);
      setProfile(updated);
      setEditing(false);
      toast.success(t.profile.editSuccess);
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const [exporting, setExporting] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  async function handleExportData() {
    if (!user) return;
    setExporting(true);
    try {
      const data = await exportUserData(user.uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bolo_citizen_data_${user.uid.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Personal data archive exported successfully!");
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeletingAccount(true);
    try {
      await deleteUserAccount(user.uid);
      toast.success("Your account and profile have been permanently deleted.");
      setDeleteConfirmOpen(false);
      setProfileDialogOpen(false);
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
    } finally {
      setDeletingAccount(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOutOfBolo();
      toast.success("You have been signed out.");
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
    }
  }

  function copyUidToClipboard(e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) return;
    navigator.clipboard.writeText(user.uid);
    setCopiedUid(true);
    toast.success("User ID copied to clipboard");
    setTimeout(() => setCopiedUid(false), 2000);
  }

  if (!user) return <>{children}</>;

  const displayName = profile?.displayName ?? user.displayName;
  const [bgColor, textColor] = avatarColor(displayName);
  const isVerified = Boolean(
    profile?.verified ?? (user.emailVerified || (user.email && user.email.includes("@")) || (user.phone && user.phone.length > 6))
  );

  // Truncate UID for display e.g. 507764d9-82bc-44b3-aa6e-ef092c...
  const truncatedUid = user.uid.length > 28 ? `${user.uid.slice(0, 28)}...` : user.uid;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        {/* ── Exact Dropdown Menu from Screenshot ── */}
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-72 rounded-2xl border border-border bg-card p-2 shadow-xl animate-in fade-in-50 zoom-in-95"
        >
          {/* Item: Profile */}
          <DropdownMenuItem
            onSelect={() => setProfileDialogOpen(true)}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:bg-secondary"
          >
            <span>{t.profile.title === "Your Profile" ? "Profile" : t.profile.title}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5 bg-border/60" />

          {/* Item: Support */}
          <DropdownMenuItem
            onSelect={() => setSupportDialogOpen(true)}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:bg-secondary"
          >
            <span>Support</span>
          </DropdownMenuItem>

          {/* Item: FAQ */}
          <DropdownMenuItem
            onSelect={() => setHelpDialogOpen(true)}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:bg-secondary"
          >
            <span>FAQ</span>
          </DropdownMenuItem>

          {/* Item: Terms of Service */}
          <DropdownMenuItem
            onSelect={() => setTosDialogOpen(true)}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:bg-secondary"
          >
            <span>Terms of Service</span>
          </DropdownMenuItem>

          {/* Item: Log out */}
          <DropdownMenuItem
            onSelect={handleSignOut}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
          >
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Full Profile & Edit Details Dialog ── */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto rounded-3xl border-border bg-card p-6 shadow-soft">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              {t.profile.title}
            </DialogTitle>
          </DialogHeader>

          {/* Avatar & Verification Banner */}
          <div className="flex items-center gap-4 rounded-2xl bg-secondary/50 p-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow-md"
              style={{ backgroundColor: bgColor, color: textColor }}
              aria-hidden="true"
            >
              {avatarInitials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-display text-base font-bold text-foreground">
                  {displayName}
                </h3>
                {isVerified ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700"
                    title={t.profile.verified}
                  >
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    {t.profile.verified}
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
                    title={t.profile.notVerified}
                  >
                    <CircleAlert className="size-3.5" aria-hidden="true" />
                    {t.profile.notVerified}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">{user.email || user.phone}</p>
            </div>
          </div>

          {/* KPI Stat */}
          <KpiCard label={t.profile.complaintsRaised} value={issueCount} />

          {/* Profile fields / edit form */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Personal Information</span>
              {!editing && (
                <button
                  type="button"
                  onClick={startEdit}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <Edit2 className="size-3.5" />
                  {t.profile.editProfile}
                </button>
              )}
            </div>

            {editing ? (
              <div className="flex flex-col gap-3">
                <EditField
                  label={t.profile.legalName}
                  value={editLegal}
                  onChange={setEditLegal}
                  placeholder="e.g. Rahul Sharma"
                />
                <EditField
                  label="Display Name"
                  value={editName}
                  onChange={setEditName}
                  placeholder="Display name"
                />
                <EditField
                  label={t.profile.mobile}
                  value={editPhone}
                  onChange={setEditPhone}
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold transition-colors hover:bg-secondary disabled:opacity-60"
                  >
                    <X className="size-4" />
                    {t.profile.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 disabled:opacity-60"
                  >
                    {saving ? (
                      <SpinnerToCheck size={18} color="#ffffff" bg="#0f766e" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    {saving ? t.profile.saving : t.profile.saveChanges}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-4">
                <InfoRow label={t.profile.legalName} value={profile?.legalName ?? user.displayName} />
                <InfoRow label={t.profile.mobile} value={profile?.phone ?? user.phone ?? "—"} />
                <InfoRow label={t.profile.email} value={user.email ?? "—"} />
                <InfoRow label="User ID" value={user.uid} />
              </div>
            )}

            {/* Privacy & Compliance Actions (GDPR / DPDP) */}
            <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-border/70 bg-secondary/30 p-3.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Data Privacy & Control</span>
                <span className="text-[10px] text-muted-foreground">DPDP / GDPR Compliant</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportData}
                  disabled={exporting}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-background text-xs font-semibold transition-colors hover:bg-secondary disabled:opacity-60"
                >
                  <Download className="size-3.5 text-primary" />
                  {exporting ? "Exporting…" : "Export My Data (JSON)"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
                >
                  <Trash2 className="size-3.5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Account Deletion Confirmation Dialog ── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md rounded-3xl border-border bg-card p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold text-destructive">
              <CircleAlert className="size-5" /> Permanently Delete Account?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground pt-1">
            <p>
              This action will permanently delete your citizen profile, phone records, and authentication account from Bolo Civic Connect.
            </p>
            <p className="text-xs text-destructive/90 font-medium">
              This action is permanent and cannot be undone (Article 17 Right to Erasure).
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-border text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-destructive text-sm font-bold text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-60"
              >
                {deletingAccount ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Support Dialog ── */}
      <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border-border bg-card p-6 shadow-soft">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <LifeBuoy className="size-5 text-primary" /> Support & Citizen Help
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-sm text-muted-foreground">
            <p>Need assistance or have an urgent civic emergency in your neighbourhood?</p>
            <div className="rounded-2xl bg-secondary/50 p-4 text-foreground">
              <p className="font-semibold">Bolo Civic Connect Helpline</p>
              <p className="text-xs text-muted-foreground mt-0.5">Email: themayankdhodi@gmail.com</p>
              {/* <p className="text-xs text-muted-foreground">Toll Free: 1800-BOLO-CIVIC (9 AM – 6 PM)</p> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── FAQ Dialog ── */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border-border bg-card p-6 shadow-soft">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <HelpCircle className="size-5 text-primary" /> FAQ (Frequently Asked Questions)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-sm text-muted-foreground">
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground">1. How do I report a civic problem?</p>
              <p className="text-xs leading-relaxed">Click "Raise an Issue" in the navigation bar. You can upload photos, take a photo directly with your camera, add the location, and submit your report.</p>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-border">
              <p className="font-semibold text-foreground">2. How are complaint statuses updated?</p>
              <p className="text-xs leading-relaxed">Issues transition from <strong>Problem Reported</strong> → <strong>Work in Progress</strong> → <strong>Problem Solved</strong> as municipal crews and community leaders take action.</p>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-border">
              <p className="font-semibold text-foreground">3. Is my identity visible to the public?</p>
              <p className="text-xs leading-relaxed">Only your chosen display name is shown on public reports. Your phone number, and account ID remain secure.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Terms of Service Dialog ── */}
      <Dialog open={tosDialogOpen} onOpenChange={setTosDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border-border bg-card p-6 shadow-soft">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <ScrollText className="size-5 text-primary" /> Terms of Service
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs leading-relaxed text-muted-foreground">
            <p>Bolo Civic Connect is a citizen grievance and community engagement platform.</p>
            <p>Users agree to report genuine civic issues responsibly without uploading abusive, misleading, or private identifiable information on public complaint cards.</p>
            <p>Your user profile information is protected and stored securely.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
