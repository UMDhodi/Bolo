import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Issue } from "./mock-data";
import type { BoloUser } from "./firebase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isIssueOwner(
  issue: Issue | null | undefined,
  user: BoloUser | null | undefined
): boolean {
  if (!issue || !user) return false;

  // 1. Direct UID match (primary backend UID field)
  if (issue.reporterUid && issue.reporterUid === user.uid) return true;
  if (issue.userId && issue.userId === user.uid) return true;

  // 2. Email match
  const userEmail = user.email?.trim().toLowerCase();
  const issueEmail = issue.reporterEmail?.trim().toLowerCase();
  if (userEmail && issueEmail && userEmail === issueEmail) return true;

  // 3. Display name match (case-insensitive & whitespace trimmed)
  const userDisplayName = user.displayName?.trim().toLowerCase();
  const issueReporter = issue.reporter?.trim().toLowerCase();
  if (userDisplayName && issueReporter && userDisplayName === issueReporter) return true;

  // 4. Email prefix match (e.g. user email "ritesh@example.com" matches reporter "Ritesh")
  if (userEmail) {
    const emailPrefix = userEmail.split("@")[0];
    if (emailPrefix && issueReporter && (emailPrefix === issueReporter || issueReporter.includes(emailPrefix))) {
      return true;
    }
  }

  return false;
}
