"use client";

import React, { useState } from "react";
import { Mail, X, Plus, AlertCircle, Users, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MultiEmailInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onFetchSystemUsers?: () => void;
  isLoadingSystemUsers?: boolean;
  systemUsersList?: { email: string; name?: string; role?: string }[];
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function MultiEmailInput({
  emails = [],
  onChange,
  placeholder = "Enter email address and press Enter or Comma...",
  className,
  disabled = false,
  onFetchSystemUsers,
  isLoadingSystemUsers = false,
  systemUsersList = [],
}: MultiEmailInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email.trim());
  };

  const addEmails = (rawText: string) => {
    if (!rawText.trim()) return;

    // Split by comma, semicolon, space, tab, or newline
    const items = rawText
      .split(/[\s,;\n\r]+/)
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0);

    if (items.length === 0) return;

    const newValidEmails: string[] = [];
    let hasInvalid = false;

    items.forEach((item) => {
      if (validateEmail(item)) {
        if (!emails.includes(item) && !newValidEmails.includes(item)) {
          newValidEmails.push(item);
        }
      } else {
        hasInvalid = true;
      }
    });

    if (newValidEmails.length > 0) {
      onChange([...emails, ...newValidEmails]);
      setInputValue("");
      setErrorMsg(null);
    }

    if (hasInvalid && newValidEmails.length === 0) {
      setErrorMsg("Please enter valid email address(es) (e.g., user@example.com).");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addEmails(inputValue);
    } else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
      // Remove last tag on backspace if input is empty
      removeEmail(emails.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    addEmails(pastedText);
  };

  const removeEmail = (index: number) => {
    if (disabled) return;
    const updated = emails.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const handleSelectUser = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!emails.includes(cleanEmail)) {
      onChange([...emails, cleanEmail]);
    }
  };

  const handleSelectAllSystemUsers = () => {
    const userEmails = systemUsersList
      .map((u) => u.email.trim().toLowerCase())
      .filter((e) => validateEmail(e));
    const combined = Array.from(new Set([...emails, ...userEmails]));
    onChange(combined);
  };

  const filteredSystemUsers = systemUsersList.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className={cn("space-y-2", className)}>
      {/* Top Bar / Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span>Recipient Emails</span>
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 rounded-full bg-muted border border-border">
            {emails.length} {emails.length === 1 ? "email" : "emails"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onFetchSystemUsers && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => {
                onFetchSystemUsers();
                setShowUserModal(true);
              }}
              className="text-[11px] font-semibold gap-1 text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
            >
              <Users className="w-3 h-3" />
              <span>Add System Users</span>
            </Button>
          )}

          {emails.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleClearAll}
              disabled={disabled}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </Button>
          )}
        </div>
      </div>

      {/* Input container box with tags */}
      <div
        className={cn(
          "min-h-[90px] p-2.5 rounded-xl border border-border bg-card text-card-foreground transition-all focus-within:border-primary/60 flex flex-wrap items-start gap-1.5",
          disabled && "opacity-60 pointer-events-none bg-muted/30"
        )}
      >
        {/* Render Email Tags */}
        {emails.map((email, idx) => {
          const isValid = validateEmail(email);
          return (
            <div
              key={`${email}-${idx}`}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all animate-fadeIn",
                isValid
                  ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                  : "bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400"
              )}
            >
              {!isValid && <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />}
              <span className="truncate max-w-[240px]">{email}</span>
              <button
                type="button"
                onClick={() => removeEmail(idx)}
                disabled={disabled}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                title="Remove email"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Text Input */}
        <div className="flex-1 min-w-[200px] flex items-center gap-1 my-0.5">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setErrorMsg(null);
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => {
              if (inputValue.trim()) {
                addEmails(inputValue);
              }
            }}
            placeholder={emails.length === 0 ? placeholder : "Add another email..."}
            disabled={disabled}
            className="border-none shadow-none focus-visible:ring-0 focus-visible:border-none p-0 h-7 text-xs bg-transparent"
          />
          {inputValue.trim().length > 0 && (
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={() => addEmails(inputValue)}
              className="shrink-0 text-[10px] font-bold h-6 px-2 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </Button>
          )}
        </div>
      </div>

      {errorMsg && (
        <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </p>
      )}

      <p className="text-[11px] text-muted-foreground">
        Tip: You can paste multiple emails separated by commas, spaces, or newlines.
      </p>

      {/* System Users Modal / Dialog */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Select System Users</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              <Input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="text-xs"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Found {filteredSystemUsers.length} user(s)
                </span>
                {filteredSystemUsers.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleSelectAllSystemUsers}
                    className="text-[11px] font-bold cursor-pointer"
                  >
                    Select All Users
                  </Button>
                )}
              </div>

              {isLoadingSystemUsers ? (
                <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
                  Loading system users...
                </div>
              ) : filteredSystemUsers.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No matching system users found.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {filteredSystemUsers.map((user) => {
                    const isAdded = emails.includes(user.email.toLowerCase());
                    return (
                      <div
                        key={user.email}
                        onClick={() => handleSelectUser(user.email)}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer",
                          isAdded
                            ? "bg-primary/10 border-primary/30 text-foreground"
                            : "bg-background border-border hover:bg-muted/50"
                        )}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-foreground truncate">{user.email}</p>
                          {(user.name || user.role) && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              {user.name} {user.role ? `• ${user.role}` : ""}
                            </p>
                          )}
                        </div>
                        {isAdded ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                            <Check className="w-3 h-3" />
                            Added
                          </span>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            className="text-[10px] font-bold h-6 px-2 shrink-0 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border bg-muted/20 flex justify-end">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setShowUserModal(false)}
                className="text-xs font-bold cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
