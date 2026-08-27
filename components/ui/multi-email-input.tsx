"use client";

import React, { useState, useMemo } from "react";
import {
  Mail,
  X,
  Plus,
  AlertCircle,
  Users,
  Check,
  Trash2,
  UserCheck,
  CheckCheck,
  MinusCircle,
  Building2,
  Contact,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClusterContacts } from "@/hooks/use-cluster-contacts";
import { useDebounce } from "@/hooks/use-debounce";
import {
  CLUSTER_CONTACTS,
  formatDisplayName,
  getOrganizationBadgeClass,
} from "@/lib/data/cluster-contacts";

export interface SubscriberItem {
  email: string;
  is_subscribed?: boolean;
  created_at?: string;
}

export interface SystemUserItem {
  email: string;
  name?: string;
  role?: string;
}

interface MultiEmailInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  sendToAllSubscribers?: boolean;
  mode?: "newsletter" | "cluster_contacts";

  // System Users
  onFetchSystemUsers?: () => void;
  isLoadingSystemUsers?: boolean;
  systemUsersList?: SystemUserItem[];

  // Subscribers
  onFetchSubscribers?: () => void;
  isLoadingSubscribers?: boolean;
  subscribersList?: SubscriberItem[];
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function MultiEmailInput({
  emails = [],
  onChange,
  placeholder = "Enter email address and press Enter or Comma...",
  className,
  disabled = false,
  sendToAllSubscribers = false,
  mode,
  onFetchSystemUsers,
  isLoadingSystemUsers = false,
  systemUsersList = [],
  onFetchSubscribers,
  isLoadingSubscribers = false,
  subscribersList = [],
}: MultiEmailInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"subscribers" | "systemUsers" | "clusterContacts">(
    mode === "newsletter" ? "subscribers" : "clusterContacts"
  );
  const [modalSearch, setModalSearch] = useState("");

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

  const handleToggleSingleEmail = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (emails.includes(cleanEmail)) {
      onChange(emails.filter((e) => e !== cleanEmail));
    } else {
      onChange([...emails, cleanEmail]);
    }
  };

  // Filtered subscribers
  const filteredSubscribers = useMemo(
    () =>
      subscribersList.filter((s) =>
        s.email && s.email.toLowerCase().includes(modalSearch.toLowerCase())
      ),
    [subscribersList, modalSearch]
  );

  // Filtered system users
  const filteredSystemUsers = useMemo(
    () =>
      systemUsersList.filter(
        (u) =>
          (u.email && u.email.toLowerCase().includes(modalSearch.toLowerCase())) ||
          (u.name && u.name.toLowerCase().includes(modalSearch.toLowerCase())) ||
          (u.role && u.role.toLowerCase().includes(modalSearch.toLowerCase()))
      ),
    [systemUsersList, modalSearch]
  );

  const debouncedModalSearch = useDebounce(modalSearch, 400);
  const { data: apiClusterContactsData } = useClusterContacts(1, null, debouncedModalSearch, 1000);

  const clusterContactsList = useMemo(() => {
    if (apiClusterContactsData?.results && apiClusterContactsData.results.length > 0) {
      return apiClusterContactsData.results.map((c) => ({
        id: c.id ? c.id.toString() : "",
        name: c.name || "",
        email: c.email || "",
        organization: c.organization || "",
      }));
    }
    return CLUSTER_CONTACTS;
  }, [apiClusterContactsData]);

  // Filtered cluster contacts
  const filteredClusterContacts = useMemo(
    () =>
      clusterContactsList.filter(
        (c) =>
          (c.email && c.email.toLowerCase().includes(modalSearch.toLowerCase())) ||
          (c.name && c.name.toLowerCase().includes(modalSearch.toLowerCase())) ||
          (c.organization && c.organization.toLowerCase().includes(modalSearch.toLowerCase()))
      ),
    [clusterContactsList, modalSearch]
  );

  // Check if all filtered subscribers are selected
  const areAllFilteredSubscribersSelected = useMemo(() => {
    if (filteredSubscribers.length === 0) return false;
    return filteredSubscribers.every((s) => emails.includes(s.email.trim().toLowerCase()));
  }, [filteredSubscribers, emails]);

  // Toggle select/deselect all subscribers
  const handleToggleAllSubscribers = () => {
    const subscriberEmails = filteredSubscribers
      .filter((s) => s.is_subscribed !== false)
      .map((s) => s.email.trim().toLowerCase())
      .filter((e) => validateEmail(e));

    if (areAllFilteredSubscribersSelected) {
      onChange(emails.filter((e) => !subscriberEmails.includes(e)));
    } else {
      const combined = Array.from(new Set([...emails, ...subscriberEmails]));
      onChange(combined);
    }
  };

  // Check if all filtered system users are selected
  const areAllFilteredSystemUsersSelected = useMemo(() => {
    if (filteredSystemUsers.length === 0) return false;
    return filteredSystemUsers.every((u) => emails.includes(u.email.trim().toLowerCase()));
  }, [filteredSystemUsers, emails]);

  // Toggle select/deselect all system users
  const handleToggleAllSystemUsers = () => {
    const userEmails = filteredSystemUsers
      .map((u) => u.email.trim().toLowerCase())
      .filter((e) => validateEmail(e));

    if (areAllFilteredSystemUsersSelected) {
      onChange(emails.filter((e) => !userEmails.includes(e)));
    } else {
      const combined = Array.from(new Set([...emails, ...userEmails]));
      onChange(combined);
    }
  };

  // Check if all filtered cluster contacts are selected
  const areAllFilteredClusterContactsSelected = useMemo(() => {
    if (filteredClusterContacts.length === 0) return false;
    return filteredClusterContacts.every((c) => emails.includes(c.email.trim().toLowerCase()));
  }, [filteredClusterContacts, emails]);

  // Toggle select/deselect all cluster contacts
  const handleToggleAllClusterContacts = () => {
    const contactEmails = filteredClusterContacts
      .map((c) => c.email.trim().toLowerCase())
      .filter((e) => validateEmail(e));

    if (areAllFilteredClusterContactsSelected) {
      onChange(emails.filter((e) => !contactEmails.includes(e)));
    } else {
      const combined = Array.from(new Set([...emails, ...contactEmails]));
      onChange(combined);
    }
  };

  const openModal = (tab: "subscribers" | "systemUsers" | "clusterContacts") => {
    setActiveTab(tab);
    setModalSearch("");
    setShowModal(true);
    if (tab === "subscribers" && onFetchSubscribers) {
      onFetchSubscribers();
    } else if (tab === "systemUsers" && onFetchSystemUsers) {
      onFetchSystemUsers();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Top Bar / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Recipient Emails</span>
          </span>
          <span className="text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted border border-border">
            {emails.length} {emails.length === 1 ? "email" : "emails"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {mode !== "newsletter" && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => openModal("clusterContacts")}
              className="text-[11px] font-semibold gap-1 cursor-pointer bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
            >
              <Contact className="w-3 h-3 text-primary" />
              <span>Cluster Contacts ({clusterContactsList.length})</span>
            </Button>
          )}

          {mode !== "cluster_contacts" && onFetchSubscribers && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => openModal("subscribers")}
              className="text-[11px] font-semibold gap-1 cursor-pointer"
            >
              <UserCheck className="w-3 h-3 text-muted-foreground" />
              <span>Select Subscribers</span>
            </Button>
          )}

          {onFetchSystemUsers && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => openModal("systemUsers")}
              className="text-[11px] font-semibold gap-1 cursor-pointer"
            >
              <Users className="w-3 h-3 text-muted-foreground" />
              <span>Select System Users</span>
            </Button>
          )}

          {emails.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleClearAll}
              disabled={disabled}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </Button>
          )}
        </div>
      </div>

      {/* Input container box with tags or All Subscribers Banner */}
      {sendToAllSubscribers ? (
        <div className="min-h-[52px] p-3 rounded-xl border border-border bg-muted/30 text-foreground flex items-center gap-3">
          <UserCheck className="w-4 h-4 text-foreground shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Sending broadcast to all active newsletter subscribers</p>
            <p className="text-[11px] text-muted-foreground">
              Recipient input is disabled because this message will be delivered to all active subscribers.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "min-h-[90px] p-2.5 rounded-xl border border-border bg-card text-card-foreground transition-all focus-within:border-border flex flex-wrap items-start gap-1.5",
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
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all animate-fadeIn",
                  isValid
                    ? "bg-muted text-foreground border-border"
                    : "bg-muted text-foreground border-border"
                )}
              >
                {!isValid && <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />}
                <span className="truncate max-w-[240px]">{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(idx)}
                  disabled={disabled}
                  className="hover:bg-muted-foreground/10 rounded-full p-0.5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
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
                className="shrink-0 text-[10px] font-semibold h-6 px-2 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </p>
      )}

      <p className="text-[11px] text-muted-foreground">
        Tip: You can select subscribers or system users, or paste multiple emails separated by commas/newlines.
      </p>

      {/* Quick Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="text-sm font-bold text-foreground">Select Email Recipients</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-border bg-muted/20 px-4 pt-2 gap-2 overflow-x-auto">
              {mode !== "newsletter" && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("clusterContacts");
                  }}
                  className={cn(
                    "px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0",
                    activeTab === "clusterContacts"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Contact className="w-3.5 h-3.5" />
                  <span>Cluster Contacts ({clusterContactsList.length})</span>
                </button>
              )}

              {mode !== "cluster_contacts" && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("subscribers");
                    if (onFetchSubscribers) onFetchSubscribers();
                  }}
                  className={cn(
                    "px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0",
                    activeTab === "subscribers"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Subscribers ({subscribersList.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setActiveTab("systemUsers");
                  if (onFetchSystemUsers) onFetchSystemUsers();
                }}
                className={cn(
                  "px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0",
                  activeTab === "systemUsers"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="w-3.5 h-3.5" />
                <span>System Users ({systemUsersList.length})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              <Input
                type="text"
                placeholder={
                  activeTab === "clusterContacts"
                    ? "Search cluster contacts by name, email, org..."
                    : activeTab === "subscribers"
                    ? "Search subscribers by email..."
                    : "Search users by name, email, or role..."
                }
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="text-xs"
              />

              {activeTab === "clusterContacts" ? (
                /* Cluster Contacts Content */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Showing {filteredClusterContacts.length} contact(s)
                    </span>
                    {filteredClusterContacts.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={handleToggleAllClusterContacts}
                        className="text-[11px] font-semibold gap-1 cursor-pointer"
                      >
                        {areAllFilteredClusterContactsSelected ? (
                          <>
                            <MinusCircle className="w-3.5 h-3.5" />
                            Deselect All
                          </>
                        ) : (
                          <>
                            <CheckCheck className="w-3.5 h-3.5" />
                            Select All Contacts
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {filteredClusterContacts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No matching cluster contacts found.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {filteredClusterContacts.map((contact) => {
                        const cleanEmail = contact.email.trim().toLowerCase();
                        const isAdded = emails.includes(cleanEmail);
                        const displayName = formatDisplayName(contact);
                        return (
                          <div
                            key={contact.id}
                            onClick={() => handleToggleSingleEmail(contact.email)}
                            className={cn(
                              "flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer select-none",
                              isAdded
                                ? "bg-muted border-border font-semibold text-foreground"
                                : "bg-background border-border hover:bg-muted/50 text-foreground"
                            )}
                          >
                            <div className="min-w-0 pr-2 space-y-0.5">
                              <p className="font-semibold text-foreground truncate">{displayName}</p>
                              <p className="font-mono text-[11px] text-muted-foreground truncate">
                                {contact.email}
                              </p>
                              <span
                                className={cn(
                                  "inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-semibold border mt-0.5",
                                  getOrganizationBadgeClass(contact.organization)
                                )}
                              >
                                {contact.organization}
                              </span>
                            </div>
                            {isAdded ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground bg-muted-foreground/10 px-2.5 py-1 rounded-full shrink-0 border border-border">
                                <Check className="w-3 h-3" />
                                Added
                              </span>
                            ) : (
                              <Button
                                type="button"
                                variant="secondary"
                                size="xs"
                                className="text-[10px] font-semibold h-6 px-2 shrink-0 cursor-pointer"
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
              ) : activeTab === "subscribers" ? (
                /* Newsletter Subscribers Content */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Showing {filteredSubscribers.length} subscriber(s)
                    </span>
                    {filteredSubscribers.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={handleToggleAllSubscribers}
                        className="text-[11px] font-semibold gap-1 cursor-pointer"
                      >
                        {areAllFilteredSubscribersSelected ? (
                          <>
                            <MinusCircle className="w-3.5 h-3.5" />
                            Deselect All
                          </>
                        ) : (
                          <>
                            <CheckCheck className="w-3.5 h-3.5" />
                            Select All Subscribers
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {isLoadingSubscribers ? (
                    <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
                      Loading subscribers list...
                    </div>
                  ) : filteredSubscribers.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No matching subscribers found.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {filteredSubscribers.map((sub) => {
                        const cleanEmail = sub.email.trim().toLowerCase();
                        const isAdded = emails.includes(cleanEmail);
                        return (
                          <div
                            key={sub.email}
                            onClick={() => handleToggleSingleEmail(sub.email)}
                            className={cn(
                              "flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer select-none",
                              isAdded
                                ? "bg-muted border-border font-semibold text-foreground"
                                : "bg-background border-border hover:bg-muted/50 text-foreground"
                            )}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-foreground truncate">{sub.email}</p>
                              <span className="text-[10px] text-muted-foreground">
                                {sub.is_subscribed !== false ? "Subscribed" : "Unsubscribed"}
                              </span>
                            </div>
                            {isAdded ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground bg-muted-foreground/10 px-2.5 py-1 rounded-full shrink-0 border border-border">
                                <Check className="w-3 h-3" />
                                Added
                              </span>
                            ) : (
                              <Button
                                type="button"
                                variant="secondary"
                                size="xs"
                                className="text-[10px] font-semibold h-6 px-2 shrink-0 cursor-pointer"
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
              ) : (
                /* System Users Content */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Showing {filteredSystemUsers.length} user(s)
                    </span>
                    {filteredSystemUsers.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={handleToggleAllSystemUsers}
                        className="text-[11px] font-semibold gap-1 cursor-pointer"
                      >
                        {areAllFilteredSystemUsersSelected ? (
                          <>
                            <MinusCircle className="w-3.5 h-3.5" />
                            Deselect All
                          </>
                        ) : (
                          <>
                            <CheckCheck className="w-3.5 h-3.5" />
                            Select All Users
                          </>
                        )}
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
                        const cleanEmail = user.email.trim().toLowerCase();
                        const isAdded = emails.includes(cleanEmail);
                        return (
                          <div
                            key={user.email}
                            onClick={() => handleToggleSingleEmail(user.email)}
                            className={cn(
                              "flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer select-none",
                              isAdded
                                ? "bg-muted border-border font-semibold text-foreground"
                                : "bg-background border-border hover:bg-muted/50 text-foreground"
                            )}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-foreground truncate">{user.email}</p>
                              {(user.name || user.role) && (
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {user.name} {user.role ? `• ${user.role}` : ""}
                                </p>
                              )}
                            </div>
                            {isAdded ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground bg-muted-foreground/10 px-2.5 py-1 rounded-full shrink-0 border border-border">
                                <Check className="w-3 h-3" />
                                Added
                              </span>
                            ) : (
                              <Button
                                type="button"
                                variant="secondary"
                                size="xs"
                                className="text-[10px] font-semibold h-6 px-2 shrink-0 cursor-pointer"
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
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">
                {emails.length} total address{emails.length === 1 ? "" : "es"} selected
              </span>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setShowModal(false)}
                className="text-xs font-semibold cursor-pointer"
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
