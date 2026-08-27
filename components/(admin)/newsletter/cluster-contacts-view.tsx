"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Copy,
  Check,
  Send,
  Filter,
  CheckSquare,
  Square,
  Plus,
  Loader2,
  X,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useClusterContacts,
  useCreateClusterContact,
} from "@/hooks/use-cluster-contacts";
import { ClusterContactItem } from "@/types/cluster-contact";
import {
  formatDisplayName,
  getOrganizationBadgeClass,
} from "@/lib/data/cluster-contacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";

export function ClusterContactsView() {
  const router = useRouter();
  const { token } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedOrg, setSelectedOrg] = useState<string>("ALL");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Reset pagination when debounced search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Add Contact Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newOrganization, setNewOrganization] = useState("");

  // Custom Hooks with debounced backend search
  const {
    data: contactsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useClusterContacts(currentPage, token, debouncedSearch, pageSize);

  const createContactMutation = useCreateClusterContact();

  const contactsList: ClusterContactItem[] = contactsData?.results || [];
  const totalCount = contactsData?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Extract unique organizations from loaded contacts for quick filter
  const organizations = useMemo(() => {
    const orgSet = new Set<string>();
    contactsList.forEach((c) => {
      if (c.organization) orgSet.add(c.organization);
    });
    return Array.from(orgSet).sort();
  }, [contactsList]);

  // Filter local contacts list by selected organization if chosen
  const paginatedContacts = useMemo(() => {
    if (selectedOrg === "ALL") return contactsList;
    return contactsList.filter((c) => c.organization === selectedOrg);
  }, [contactsList, selectedOrg]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleOrgChange = (org: string) => {
    setSelectedOrg(org);
  };

  const handleToggleSelect = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSelectAllCurrentPage = () => {
    const pageEmails = paginatedContacts.map((c) => c.email);
    const allSelected = pageEmails.every((e) => selectedEmails.includes(e));
    if (allSelected) {
      setSelectedEmails((prev) => prev.filter((e) => !pageEmails.includes(e)));
    } else {
      setSelectedEmails((prev) => Array.from(new Set([...prev, ...pageEmails])));
    }
  };

  const handleClearSelection = () => {
    setSelectedEmails([]);
  };

  const handleCopySingle = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast.success(`Copied: ${email}`);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleCopySelected = () => {
    if (selectedEmails.length === 0) {
      toast.error("Please select at least one contact.");
      return;
    }
    const text = selectedEmails.join(", ");
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${selectedEmails.length} email addresses to clipboard.`);
  };

  const handleSendEmailToSelected = () => {
    const targets = selectedEmails.length > 0 ? selectedEmails : paginatedContacts.map((c) => c.email);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("decm_newsletter_recipient_emails", JSON.stringify(targets));
    }
    router.push("/assement/newsletter/send-email?mode=cluster_contacts");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.error("Email address is required.");
      return;
    }
    if (!newOrganization.trim()) {
      toast.error("Organization is required.");
      return;
    }

    createContactMutation.mutate(
      {
        payload: {
          name: newName.trim(),
          email: newEmail.trim(),
          organization: newOrganization.trim(),
        },
        token,
      },
      {
        onSuccess: (data) => {
          toast.success(`Cluster contact "${data.name || data.email}" created successfully!`);
          setShowAddModal(false);
          setNewName("");
          setNewEmail("");
          setNewOrganization("");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to create cluster contact.");
        },
      }
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  Cluster Contact List
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                    {totalCount} Total
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  Official directory of DECM Cluster focal points, partner agencies, government departments, and stakeholders.
                </p>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer hover:bg-muted"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="text-xs font-semibold gap-1.5 rounded-xl shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendEmailToSelected}
              className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer hover:bg-muted"
            >
              <Send className="w-3.5 h-3.5" />
              {selectedEmails.length > 0
                ? `Email Selected (${selectedEmails.length})`
                : "Compose Broadcast"}
            </Button>
          </div>
        </div>

        {/* Tab Quick Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/assement/newsletter/subscribers"
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent transition-all"
          >
            Subscribers List
          </Link>
          <Link
            href="/assement/newsletter/send-email"
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent transition-all"
          >
            Send Email
          </Link>
          <Link
            href="/assement/newsletter/contacts"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-muted text-foreground border border-border transition-all shadow-2xs"
          >
            Cluster Contact List
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
        {/* Search, Filter & Batch Toolbar */}
        <div className="p-4 sm:p-5 border-b border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, email, or organization..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 text-xs h-9 bg-background border-border rounded-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Organization Dropdown Filter */}
            {organizations.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <select
                  value={selectedOrg}
                  onChange={(e) => handleOrgChange(e.target.value)}
                  className="text-xs bg-background border border-border rounded-xl px-3 py-2 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[240px]"
                >
                  <option value="ALL">All Organizations</option>
                  {organizations.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Batch Selection Banner */}
          {selectedEmails.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                <span className="font-semibold text-primary">
                  {selectedEmails.length} contact{selectedEmails.length > 1 ? "s" : ""} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopySelected}
                  className="h-7 text-xs font-semibold gap-1 rounded-lg bg-background cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  Copy Selected
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleSendEmailToSelected}
                  className="h-7 text-xs font-semibold gap-1 rounded-lg cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  Email Selected
                </Button>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-xs text-muted-foreground hover:text-foreground font-medium px-2 py-1 cursor-pointer"
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading / Error / Contacts Table */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span>Loading cluster contacts list...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-xs text-rose-500 space-y-2">
            <p>Error loading cluster contacts: {(error as any)?.message || "Unknown error"}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-xs rounded-xl"
            >
              Try Again
            </Button>
          </div>
        ) : paginatedContacts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No contacts found"
              description="No cluster contact matches your current search or filter criteria."
              icon={Users}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="w-10 px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={handleSelectAllCurrentPage}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      title="Select / Deselect all on current page"
                    >
                      {paginatedContacts.every((c) => selectedEmails.includes(c.email)) ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">Name / Focal Person</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Organization / Affiliation</th>
                  <th className="px-4 py-3 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedContacts.map((contact) => {
                  const isSelected = selectedEmails.includes(contact.email);
                  const displayName = formatDisplayName(contact);
                  const isCopied = copiedEmail === contact.email;
                  const initials = displayName
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "C";

                  return (
                    <tr
                      key={contact.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      {/* Select checkbox */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(contact.email)}
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                          ) : (
                            <Square className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </td>

                      {/* Name with initials */}
                      <td className="px-4 py-3 font-semibold text-foreground">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{displayName}</p>
                            {contact.name && contact.email && (
                              <p className="text-[10px] text-muted-foreground font-normal">
                                {contact.email.includes("@") ? contact.email.split("@")[1] : contact.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground">
                          <a
                            href={`mailto:${contact.email}`}
                            className="hover:text-primary hover:underline"
                          >
                            {contact.email}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopySingle(contact.email)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            title="Copy email"
                          >
                            {isCopied ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Organization Badge */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getOrganizationBadgeClass(
                            contact.organization
                          )}`}
                        >
                          {contact.organization}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                sessionStorage.setItem(
                                  "decm_newsletter_recipient_emails",
                                  JSON.stringify([contact.email])
                                );
                              }
                              router.push("/assement/newsletter/send-email?mode=cluster_contacts");
                            }}
                            className="h-7 px-2 text-[11px] font-semibold gap-1 text-primary hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            Email
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer with Pagination */}
        {totalCount > 0 && (
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Showing</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-background border border-border rounded-lg px-2 py-1 text-xs text-foreground font-semibold cursor-pointer"
              >
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>of {totalCount} contacts</span>
            </div>

            <Pagination
              currentPage={currentPage}
              hasPrevious={currentPage > 1}
              hasNext={currentPage < totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add New Cluster Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Add Cluster Contact</h3>
                  <p className="text-xs text-muted-foreground">Create a new focal point in the cluster contact roster.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Contact Name <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="e.g. john.doe@organization.org"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Organization / Agency <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. UNICEF, Red Cross, NDMO, etc."
                  value={newOrganization}
                  onChange={(e) => setNewOrganization(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  disabled={createContactMutation.isPending}
                  className="text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={createContactMutation.isPending}
                  className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer shadow-xs"
                >
                  {createContactMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Create Contact
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
