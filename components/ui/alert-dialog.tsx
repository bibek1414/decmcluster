import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  pendingText?: string;
  variant?: "destructive" | "default";
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isPending = false,
  pendingText,
  variant = "destructive",
}: AlertDialogProps) {
  if (!isOpen) return null;

  const defaultPendingText =
    pendingText || (variant === "destructive" ? "Deleting..." : "Processing...");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
      <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl mx-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg shrink-0 ${
              variant === "destructive"
                ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600"
                : "bg-amber-50 dark:bg-amber-950/20 text-amber-600"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-9 cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isPending}
            className={`h-9 font-bold cursor-pointer ${
              variant === "destructive"
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : ""
            }`}
          >
            {isPending ? defaultPendingText : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
