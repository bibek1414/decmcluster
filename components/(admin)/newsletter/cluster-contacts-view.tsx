"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Search,
  Users,
  Copy,
  Check,
  Send,
  Download,
  Building2,
  Filter,
  CheckSquare,
  Square,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  CLUSTER_CONTACTS,
  ClusterContact,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<string>("ALL");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Extract unique organizations for filter dropdown
  const organizations = useMemo(() => {
    const orgSet = new Set<string>();
    CLUSTER_CONTACTS.forEach((c) => {
      if (c.organization) orgSet.add(c.organization);
    });
    return Array.from(orgSet).sort();
  }, []);

  // Filter contacts by search query & organization
  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CLUSTER_CONTACTS.filter((c) => {
      const matchesOrg = selectedOrg === "ALL" || c.organization === selectedOrg;
      if (!matchesOrg) return false;

      if (!q) return true;
      const nameMatch = c.name.toLowerCase().includes(q);
      const emailMatch = c.email.toLowerCase().includes(q);
      const orgMatch = c.organization.toLowerCase().includes(q);
      return nameMatch || emailMatch || orgMatch;
    });
  }, [searchQuery, selectedOrg]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredContacts.length / pageSize) || 1;
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleOrgChange = (org: string) => {
    setSelectedOrg(org);
    setCurrentPage(1);
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

  const handleSelectAllFiltered = () => {
    setSelectedEmails(filteredContacts.map((c) => c.email));
    toast.success(`Selected all ${filteredContacts.length} contacts.`);
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

  const handleCopyAll = () => {
    const allEmails = filteredContacts.map((c) => c.email).join(", ");
    navigator.clipboard.writeText(allEmails);
    setCopiedAll(true);
    toast.success(`Copied all ${filteredContacts.length} email addresses.`);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["ID,Name,Email,Organization"];
    const rows = filteredContacts.map(
      (c) =>
        `"${c.id}","${c.name.replace(/"/g, '""')}","${c.email}","${c.organization.replace(/"/g, '""')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `decm_cluster_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded.");
  };

  const handleSendEmailToSelected = () => {
    const targets = selectedEmails.length > 0 ? selectedEmails : filteredContacts.map((c) => c.email);
    // Store in sessionStorage or query param for send email page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("decm_newsletter_recipient_emails", JSON.stringify(targets));
    }
    router.push("/assement/newsletter/send-email?source=cluster_contacts");
  };

  // Stats
  const totalCount = CLUSTER_CONTACTS.length;
  const govCount = CLUSTER_CONTACTS.filter((c) => c.organization.includes("Gov") || c.organization.includes("NDMO")).length;
  const unCount = CLUSTER_CONTACTS.filter(
    (c) =>
      c.organization.includes("UN") ||
      c.organization.includes("WHO") ||
      c.organization.includes("WFP") ||
      c.organization.includes("IOM")
  ).length;

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

          {/* Top Quick Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer hover:bg-muted"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer hover:bg-muted"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              Copy All ({filteredContacts.length})
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSendEmailToSelected}
              className="text-xs font-semibold gap-1.5 rounded-xl shadow-xs cursor-pointer"
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Contacts</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalCount}</p>
          <p className="text-[11px] text-muted-foreground">DECM Cluster roster</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Gov & NDMO</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{govCount}</p>
          <p className="text-[11px] text-muted-foreground">Vanuatu Government focal points</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">UN & Multilateral</span>
            <Building2 className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{unCount}</p>
          <p className="text-[11px] text-muted-foreground">UNICEF, UNDP, WHO, WFP, IOM</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Partner Orgs</span>
            <Building2 className="w-4 h-4 text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{organizations.length}</p>
          <p className="text-[11px] text-muted-foreground">Active participating agencies</p>
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
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <select
                value={selectedOrg}
                onChange={(e) => handleOrgChange(e.target.value)}
                className="text-xs bg-background border border-border rounded-xl px-3 py-2 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[240px]"
              >
                <option value="ALL">All Organizations ({totalCount})</option>
                {organizations.map((org) => {
                  const count = CLUSTER_CONTACTS.filter((c) => c.organization === org).length;
                  return (
                    <option key={org} value={org}>
                      {org} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Batch Selection Banner */}
          {selectedEmails.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                <span className="font-semibold text-primary">
                  {selectedEmails.length} contact{selectedEmails.length > 1 ? "s" : ""} selected
                </span>
                <button
                  type="button"
                  onClick={handleSelectAllFiltered}
                  className="text-[11px] underline text-primary hover:text-primary/80 font-medium ml-2 cursor-pointer"
                >
                  Select all {filteredContacts.length} in current view
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopySelected}
                  className="h-7 text-xs font-semibold gap-1 rounded-lg bg-background"
                >
                  <Copy className="w-3 h-3" />
                  Copy Selected
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleSendEmailToSelected}
                  className="h-7 text-xs font-semibold gap-1 rounded-lg"
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

        {/* Contacts Table */}
        {filteredContacts.length === 0 ? (
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
                            {contact.name && (
                              <p className="text-[10px] text-muted-foreground font-normal">
                                {contact.email.split("@")[1]}
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
                              router.push("/assement/newsletter/send-email?source=cluster_contacts");
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
        {filteredContacts.length > 0 && (
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
              <span>of {filteredContacts.length} contacts</span>
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
    </div>
  );
}
