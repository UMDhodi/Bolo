import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Save, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpinnerToCheck from "@/components/loader";
import { updateIssue, getFirebaseErrorMessage } from "@/lib/firebase";
import type { Issue, IssueStatus } from "@/lib/mock-data";

interface EditIssueDialogProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

const CATEGORIES = [
  "Road damage",
  "Streetlight",
  "Drainage",
  "Garbage collection",
  "Water leak",
  "Public space",
  "Civic Issue",
];

export function EditIssueDialog({
  issue,
  open,
  onOpenChange,
  onUpdated,
}: EditIssueDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<IssueStatus>("reported");
  const [category, setCategory] = useState("Civic Issue");
  const [images, setImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setLocation(issue.location);
      setAddress(issue.address);
      setStatus(issue.status);
      setCategory(issue.category || "Civic Issue");
      setImages(issue.images || []);
      setNewImageFiles([]);
    }
  }, [issue]);

  if (!issue) return null;

  function handleRemoveExistingImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddNewFiles(files: FileList | null) {
    if (!files) return;
    const added = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setNewImageFiles((prev) => [...prev, ...added]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!issue) return;

    if (title.trim().length < 5) {
      toast.error("Please enter a clear title (at least 5 characters).");
      return;
    }
    if (description.trim().length < 15) {
      toast.error("Please provide sufficient description (at least 15 characters).");
      return;
    }
    if (location.trim().length < 3) {
      toast.error("Please enter a valid location.");
      return;
    }

    setSubmitting(true);
    try {
      await updateIssue(issue.id, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        address: address.trim(),
        status,
        category,
        images,
        newImages: newImageFiles,
      });

      setSubmitting(false);
      toast.success("Complaint updated successfully!");
      onOpenChange(false);
      if (onUpdated) onUpdated();
    } catch (err) {
      setSubmitting(false);
      toast.error(getFirebaseErrorMessage(err));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-border bg-card p-6 shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            Edit Civic Complaint
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update the grievance details, status, or location info for ID: {issue.id}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="edit-title" className="mb-1.5 block text-sm font-semibold">
              Issue Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-xl bg-background"
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-sm font-semibold">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 rounded-xl bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-1.5 block text-sm font-semibold">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as IssueStatus)}>
                <SelectTrigger className="h-11 rounded-xl bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reported">Problem Reported (Red)</SelectItem>
                  <SelectItem value="progress">Work in Progress (Amber)</SelectItem>
                  <SelectItem value="solved">Solved (Green)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-location" className="mb-1.5 block text-sm font-semibold">
                Location (Locality, City)
              </Label>
              <Input
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Krishna Nagar, Delhi"
                className="h-11 rounded-xl bg-background"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-address" className="mb-1.5 block text-sm font-semibold">
                Specific Address / Landmark
              </Label>
              <Input
                id="edit-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Main road near metro station"
                className="h-11 rounded-xl bg-background"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-description" className="mb-1.5 block text-sm font-semibold">
              Description & Details
            </Label>
            <Textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl bg-background"
              required
            />
          </div>

          {/* Photos */}
          <div>
            <Label className="mb-1.5 block text-sm font-semibold">Attached Photos</Label>
            <div className="flex flex-wrap items-center gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative size-20 overflow-hidden rounded-xl border border-border">
                  <img src={img} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-destructive text-white"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-secondary/40 text-muted-foreground hover:border-primary">
                <ImagePlus className="size-5" />
                <span className="text-[10px] font-semibold">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => handleAddNewFiles(e.target.files)}
                />
              </label>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <SpinnerToCheck size={20} color="#ffffff" bg="#0f766e" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
