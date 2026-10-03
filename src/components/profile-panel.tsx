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
  Lock,
  KeyRound,
  ChevronDown,
  ChevronUp,
  Camera,
  Activity,
  ShieldAlert,
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import SpinnerToCheck from "@/components/loader";
import BSpinnerToCheck from "@/components/bspinnertocheck";
import { useAuth } from "@/components/auth-context";
import { useT } from "@/components/language-context";
import {
  getUserProfile,
  getUserIssueCount,
  updateUserProfile,
  updateUserPassword,
  exportUserData,
  deleteUserAccount,
  getFirebaseErrorMessage,
  signOutOfBolo,
  uploadAvatar,
  type UserProfile,
} from "@/lib/supabase";
import { validateStrongPassword } from "@/lib/utils";

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
  return (AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? ["#7c3aed", "#ede9fe"]) as [
    string,
    string,
  ];
}

// ── Stat KPI Card using shadcn Card ─────────────────────────────────────────
function KpiCard({ label, value }: { label: string; value: number | null }) {
  return (
    <Card className="rounded-2xl border-border bg-secondary/30 text-center shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-4">
        <span className="text-3xl font-bold tracking-tight text-primary tabular-nums">
          {value === null ? "—" : value}
        </span>
        <span className="mt-1 text-xs font-semibold text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}

// ── Read-only field row ─────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  action,
}: {
  label: string;
  value?: string | null;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground break-all">
          {value || <span className="text-muted-foreground italic">—</span>}
        </span>
      </div>
      {action}
    </div>
  );
}

// ── Editable text field using shadcn Label and Input ────────────────────────
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
    <div className="flex flex-col gap-1.5">
      <Label className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl bg-background text-sm"
      />
    </div>
  );
}

// ── Main ProfilePanel (Dropdown Menu + Dialog with Tabs, ScrollArea & Cards) ─
export function ProfilePanel({ children }: { children: React.ReactNode }) {
  const { user, profile: contextProfile, setProfile: setContextProfile } = useAuth();
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editLegal, setEditLegal] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Fetch profile + KPI when profile dialog opens
  useEffect(() => {
    if (!user) return;
    void (async () => {
      const prof = await getUserProfile(user.uid);
      const count = await getUserIssueCount(
        user.uid,
        prof?.displayName ?? user.displayName,
        prof?.email ?? user.email,
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
        ...(editName.trim() ? { displayName: editName.trim() } : {}),
        ...(editLegal.trim() ? { legalName: editLegal.trim() } : {}),
        ...(editPhone.trim() ? { phone: editPhone.trim() } : {}),
      });
      const updated = await getUserProfile(user.uid);
      if (updated) {
        setProfile(updated);
        setContextProfile(updated);
      }
      setEditing(false);
      toast.success(t.profile.editSuccess);
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be under 5 MB.");
      return;
    }
    setUploadingAvatar(true);
    try {
      const publicUrl = await uploadAvatar(user.uid, file);
      await updateUserProfile(user.uid, { avatarUrl: publicUrl });
      const updated = await getUserProfile(user.uid);
      if (updated) {
        setProfile(updated);
        setContextProfile(updated);
      }
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
    } finally {
      setUploadingAvatar(false);
    }
  }

  const [exporting, setExporting] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordExpanded, setPasswordExpanded] = useState(false);

  const newPwdValidation = validateStrongPassword(newPassword);

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    const pwdValidation = validateStrongPassword(newPassword);
    if (!pwdValidation.valid) {
      toast.error(`Password requirement: ${pwdValidation.errors.join(", ")}`);
      return;
    }

    setUpdatingPassword(true);
    try {
      await updateUserPassword(newPassword);
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordExpanded(false);
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
    } finally {
      setUpdatingPassword(false);
    }
  }

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
      if (typeof window !== "undefined") {
        window.location.replace("/auth");
      }
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
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

  const displayName = profile?.displayName ?? contextProfile?.displayName ?? user.displayName;
  const effectiveAvatar =
    profile?.avatarUrl ||
    profile?.avatar_url ||
    contextProfile?.avatarUrl ||
    contextProfile?.avatar_url ||
    user.avatarUrl;
  const [bgColor, textColor] = avatarColor(displayName);
  const isVerified = Boolean(
    profile?.verified ??
    (user.emailVerified ||
      (user.email && user.email.includes("@")) ||
      (user.phone && user.phone.length > 6)),
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        {/* ── Dropdown Menu Content ── */}
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-72 rounded-2xl border border-border bg-card p-2 shadow-xl animate-in fade-in-50 zoom-in-95"
        >
          {/* Top user summary with shadcn Avatar */}
          <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-2.5 mb-1">
            <Avatar className="size-10 border border-border">
              {effectiveAvatar && <AvatarImage src={effectiveAvatar} alt={displayName} className="object-cover" />}
              <AvatarFallback style={{ backgroundColor: bgColor, color: textColor }} className="text-xs font-bold">
                {avatarInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">{displayName}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user.email || user.phone}</p>
            </div>
          </div>

          <DropdownMenuSeparator className="my-1 bg-border/60" />

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

      {/* ── Upgraded Profile Dialog with Tabs, Cards, ScrollArea, Avatar, Badges ── */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-xl rounded-3xl border-border bg-card p-0 shadow-2xl flex flex-col overflow-hidden">
          <DialogHeader className="p-6 pb-2 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="font-display text-2xl font-bold text-foreground">
                  {t.profile.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Manage your citizen credentials, community activity, and account security.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* ScrollArea with ScrollBar for fluid scrolling */}
          <ScrollArea className="flex-1 max-h-[calc(92vh-100px)] p-6 pt-4">
            {/* Citizen Header Card */}
            <Card className="rounded-2xl border-border bg-secondary/40 shadow-none mb-6">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative group shrink-0">
                  <Avatar className="size-16 border-2 border-border shadow-md">
                    {effectiveAvatar && (
                      <AvatarImage src={effectiveAvatar} alt={displayName} className="object-cover" />
                    )}
                    <AvatarFallback
                      style={{ backgroundColor: bgColor, color: textColor }}
                      className="text-lg font-bold"
                    >
                      {avatarInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="profile-panel-avatar-input"
                    title="Change profile photo"
                    className="absolute -bottom-1 -right-1 grid size-7 cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
                  >
                    {uploadingAvatar ? (
                      <SpinnerToCheck size={14} color="#ffffff" bg="#0f766e" />
                    ) : (
                      <Camera className="size-3.5" />
                    )}
                    <input
                      id="profile-panel-avatar-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploadingAvatar}
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-display text-base font-bold text-foreground">
                      {displayName}
                    </h3>
                    {isVerified ? (
                      <Badge variant="outline" className="border-emerald-500/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1 text-[11px] font-semibold py-0.5 px-2">
                        <BadgeCheck className="size-3.5" />
                        {t.profile.verified}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/40 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 gap-1 text-[11px] font-semibold py-0.5 px-2">
                        <CircleAlert className="size-3.5" />
                        {t.profile.notVerified}
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">{user.email || user.phone}</p>
                  <label
                    htmlFor="profile-panel-avatar-input"
                    className="mt-1 inline-block cursor-pointer text-[11px] font-semibold text-primary hover:underline"
                  >
                    {effectiveAvatar ? "Change photo" : "Upload photo"}
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Organized Tab Navigation with shadcn Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-3 w-full rounded-2xl bg-secondary/60 p-1 mb-5">
                <TabsTrigger value="info" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <User className="size-3.5 mr-1.5" /> Info
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Activity className="size-3.5 mr-1.5" /> Activity
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-xl text-xs font-bold py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Lock className="size-3.5 mr-1.5" /> Security
                </TabsTrigger>
              </TabsList>

              {/* ── Tab 1: Info ── */}
              <TabsContent value="info" className="space-y-4 focus-visible:outline-none">
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">Personal Information</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">Your verified civic identity details</CardDescription>
                    </div>
                    {!editing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={startEdit}
                        className="rounded-full gap-1.5 text-xs font-semibold"
                      >
                        <Edit2 className="size-3.5" />
                        {t.profile.editProfile}
                      </Button>
                    )}
                  </CardHeader>

                  <CardContent className="p-5 pt-0">
                    {editing ? (
                      <div className="flex flex-col gap-3 pt-2">
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
                          <Button
                            type="button"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={saving}
                            className="flex-1 rounded-xl"
                          >
                            <X className="size-4 mr-1.5" />
                            {t.profile.cancel}
                          </Button>
                          <Button
                            type="button"
                            onClick={save}
                            disabled={saving}
                            className="flex-1 rounded-xl bg-primary text-primary-foreground"
                          >
                            {saving ? (
                              <SpinnerToCheck size={18} color="#ffffff" bg="#0f766e" />
                            ) : (
                              <Save className="size-4 mr-1.5" />
                            )}
                            {saving ? t.profile.saving : t.profile.saveChanges}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/60">
                        <InfoRow
                          label={t.profile.legalName}
                          value={profile?.legalName ?? user.displayName}
                        />
                        <InfoRow label={t.profile.mobile} value={profile?.phone ?? user.phone ?? "—"} />
                        <InfoRow label={t.profile.email} value={user.email ?? "—"} />
                        <InfoRow
                          label="Citizen User ID"
                          value={user.uid}
                          action={
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={copyUidToClipboard}
                              className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                              title="Copy Citizen ID"
                            >
                              {copiedUid ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                              <span className="sr-only">Copy UID</span>
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Tab 2: Activity ── */}
              <TabsContent value="activity" className="space-y-4 focus-visible:outline-none">
                <div className="grid grid-cols-2 gap-3">
                  <KpiCard label={t.profile.complaintsRaised} value={issueCount} />
                  <Card className="rounded-2xl border-border bg-secondary/30 text-center shadow-none flex flex-col items-center justify-center p-4">
                    <span className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                      Active
                    </span>
                    <span className="mt-1 text-xs font-semibold text-muted-foreground">Community Standing</span>
                  </Card>
                </div>

                <Card className="rounded-2xl border-border bg-card shadow-sm p-4">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                    Grievance Contribution Summary
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Every complaint you raise contributes to verifiable local civic accountability. You can filter and view your submitted complaints on the home screen using the "My Complaints" toggle.
                  </p>
                </Card>
              </TabsContent>

              {/* ── Tab 3: Security & Privacy ── */}
              <TabsContent value="security" className="space-y-4 focus-visible:outline-none">
                {/* Direct Password Update Card */}
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="size-4 text-primary" />
                        <CardTitle className="text-sm font-bold text-foreground">Password & Credentials</CardTitle>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPasswordExpanded(!passwordExpanded);
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className="text-xs font-bold text-primary h-8 px-2"
                      >
                        {passwordExpanded ? (
                          <>Cancel <ChevronUp className="size-3.5 ml-1" /></>
                        ) : (
                          <>Change Password <ChevronDown className="size-3.5 ml-1" /></>
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {passwordExpanded && (
                    <CardContent className="p-4 pt-2 border-t border-border/60">
                      <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-3">
                        <div>
                          <Label className="mb-1 block text-[11px] font-bold text-foreground">
                            New Password
                          </Label>
                          <div className="flex items-center rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                            <span className="pl-3 text-muted-foreground">
                              <KeyRound className="size-3.5" />
                            </span>
                            <Input
                              type="password"
                              autoComplete="new-password"
                              disabled={updatingPassword}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="8+ characters (Aa, 1, #)"
                              className="h-9 border-0 bg-transparent text-xs focus-visible:ring-0 shadow-none"
                              required
                            />
                          </div>
                          {newPassword && (
                            <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-3">
                              <RequirementItem met={newPwdValidation.hasMinLength} label="8+ chars" />
                              <RequirementItem met={newPwdValidation.hasUpper} label="Uppercase" />
                              <RequirementItem met={newPwdValidation.hasLower} label="Lowercase" />
                              <RequirementItem met={newPwdValidation.hasNumber} label="Number" />
                              <RequirementItem met={newPwdValidation.hasSpecial} label="Symbol" />
                            </div>
                          )}
                        </div>

                        <div>
                          <Label className="mb-1 block text-[11px] font-bold text-foreground">
                            Confirm New Password
                          </Label>
                          <div className="flex items-center rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                            <span className="pl-3 text-muted-foreground">
                              <KeyRound className="size-3.5" />
                            </span>
                            <Input
                              type="password"
                              autoComplete="new-password"
                              disabled={updatingPassword}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Repeat new password"
                              className="h-9 border-0 bg-transparent text-xs focus-visible:ring-0 shadow-none"
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={updatingPassword || !newPassword || newPassword !== confirmPassword}
                          className="mt-1 h-9 w-full rounded-xl bg-primary text-xs font-bold"
                        >
                          {updatingPassword ? (
                            <SpinnerToCheck size={16} color="#ffffff" bg="#0f766e" />
                          ) : (
                            <Save className="size-3.5 mr-1.5" />
                          )}
                          {updatingPassword ? "Updating Password..." : "Update Password"}
                        </Button>
                      </form>
                    </CardContent>
                  )}
                </Card>

                {/* Privacy & Compliance Actions Card */}
                <Card className="rounded-2xl border-border bg-secondary/30 shadow-none">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-foreground">
                        Data Privacy & Compliance (DPDP / GDPR)
                      </span>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                        Encrypted
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExportData}
                      disabled={exporting}
                      className="flex-1 rounded-xl text-xs gap-1.5 h-9"
                    >
                      <Download className="size-3.5 text-primary" />
                      {exporting ? "Exporting…" : "Export Data (JSON)"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteConfirmOpen(true)}
                      className="rounded-xl text-xs gap-1.5 h-9"
                    >
                      <Trash2 className="size-3.5" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* ── Account Deletion Confirmation AlertDialog (shadcn AlertDialog) ── */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="max-w-md rounded-3xl border-border bg-card p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display text-lg font-bold text-destructive">
              <CircleAlert className="size-5" /> Permanently Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground space-y-2 pt-1">
              <p>
                This action will permanently delete your citizen profile, phone records, and authentication credentials from Bolo Civic Connect.
              </p>
              <p className="text-xs text-destructive font-medium">
                This action is permanent and cannot be undone (Article 17 Right to Erasure).
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2 sm:gap-2">
            <AlertDialogCancel className="rounded-xl border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingAccount ? (
                <BSpinnerToCheck size={18} color="#ffffff" bg="#dc2626" />
              ) : null}
              {deletingAccount ? "Deleting…" : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <Card className="rounded-2xl bg-secondary/50 p-4 border-border text-foreground shadow-none">
              <p className="font-semibold">Bolo Civic Connect Helpline</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Email: themayankdhodi@gmail.com
              </p>
            </Card>
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
          <ScrollArea className="max-h-[60vh] pr-2">
            <div className="space-y-3 pt-2 text-sm text-muted-foreground">
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground">1. How do I report a civic problem?</p>
                <p className="text-xs leading-relaxed">
                  Click "Raise an Issue" in the navigation bar. You can upload photos, take a photo
                  directly with your camera, add the location, and submit your report.
                </p>
              </div>
              <Separator />
              <div className="space-y-1.5 pt-2">
                <p className="font-semibold text-foreground">
                  2. How are complaint statuses updated?
                </p>
                <p className="text-xs leading-relaxed">
                  Issues transition from <strong>Problem Reported</strong> →{" "}
                  <strong>Work in Progress</strong> → <strong>Problem Solved</strong> as municipal
                  crews and community leaders take action.
                </p>
              </div>
              <Separator />
              <div className="space-y-1.5 pt-2">
                <p className="font-semibold text-foreground">
                  3. Is my identity visible to the public?
                </p>
                <p className="text-xs leading-relaxed">
                  Only your chosen display name is shown on public reports. Your phone number and
                  account ID remain private and secure.
                </p>
              </div>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
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
            <p>
              Users agree to report genuine civic issues responsibly without uploading abusive,
              misleading, or private identifiable information on public complaint cards.
            </p>
            <p>Your user profile information is protected and stored securely.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-1 text-[10px] transition-colors ${
        met ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/80"
      }`}
    >
      {met ? (
        <Check className="size-3 shrink-0 stroke-[3]" />
      ) : (
        <span className="inline-block size-1.5 rounded-full bg-muted-foreground/40 ml-1 mr-0.5" />
      )}
      <span>{label}</span>
    </div>
  );
}
