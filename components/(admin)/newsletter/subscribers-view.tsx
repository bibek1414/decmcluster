"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Search,
  Trash2,
  BadgeCheck,
  BadgeX,
  Plus,
  Send,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useAdminNewsletterSubscribers,
  useDeleteNewsletterSubscriber,
  useUpdateNewsletterSubscriber,
  useSubscribeNewsletter,
} from "@/hooks/use-newsletter";
import { useDebounce } from "@/hooks/use-debounce";
import { NewsletterSubscription } from "@/types/newsletter";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";
import { AlertDialog } from "@/components/ui/alert-dialog";

export function SubscribersView() {
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Add subscriber modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  // Delete modal target
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscription | null>(null);

  const isSuperAdmin = user?.role === "Superadmin";
  const canDelete = isSuperAdmin;

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch subscribers list
  const { data, isLoading, isPlaceholderData, error } = useAdminNewsletterSubscribers(
    page,
    token,
    debouncedSearch
  );

  const subscribersList = data?.results || [];

  // Mutations
  const subscribeMutation = useSubscribeNewsletter();
  const updateMutation = useUpdateNewsletterSubscriber();
  const deleteMutation = useDeleteNewsletterSubscriber();

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newEmail.trim();
    if (!cleanEmail) {
      toast.error("Email is required.");
      return;
    }

    subscribeMutation.mutate(cleanEmail, {
      onSuccess: () => {
        toast.success(`Subscriber "${cleanEmail}" added successfully.`);
        setIsAddOpen(false);
        setNewEmail("");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to add subscriber.");
      },
    });
  };

  const handleToggleSubscription = (item: NewsletterSubscription) => {
    const nextStatus = !item.is_subscribed;
    updateMutation.mutate(
      {
        id: item.id,
        payload: { is_subscribed: nextStatus },
        token,
      },
      {
        onSuccess: () => {
          toast.success(
            `Subscriber "${item.email}" set to ${nextStatus ? "Subscribed" : "Unsubscribed"}.`
          );
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update subscriber status.");
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(
      { id: deleteTarget.id, token },
      {
        onSuccess: () => {
          toast.success(`Subscriber "${deleteTarget.email}" deleted successfully.`);
          setDeleteTarget(null);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to delete subscriber.");
          setDeleteTarget(null);
        },
      }
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn relative">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <PageHeader
          title="Newsletter Subscribers"
          description={
            <div className="flex flex-col gap-0.5">
              <span>View and manage users subscribed to DECM Cluster email updates</span>
              {data && (
                <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                  {data.count} total subscriber{data.count === 1 ? "" : "s"}
                </span>
              )}
            </div>
          }
          actions={
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                onClick={() => setIsAddOpen(true)}
                className="cursor-pointer font-bold gap-1.5 h-9 text-xs"
              >
                <Plus className="h-4 w-4" /> Add Subscriber
              </Button>
              <Button
                asChild
                variant="outline"
                className="cursor-pointer font-bold gap-1.5 h-9 text-xs border-primary/30 text-primary hover:bg-primary/5"
              >
                <Link href="/assement/newsletter/send-email">
                  <Send className="h-3.5 w-3.5" /> Send Newsletter Email
                </Link>
              </Button>
            </div>
          }
        />

        {/* Tab Quick Links */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Link
            href="/assement/newsletter/subscribers"
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground border border-primary shadow-xs transition-colors"
          >
            Subscribers List
          </Link>
          <Link
            href="/assement/newsletter/send-email"
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent transition-colors"
          >
            Send Email
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscribers by email address..."
              className="h-9 pl-9 w-full bg-background"
            />
          </div>
        </div>

        {/* Table / Empty State / Loading */}
        <div className="relative min-h-[200px]">
          {isLoading || isPlaceholderData ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-muted rounded-xl w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              Failed to load subscribers: {(error as Error).message}
            </div>
          ) : subscribersList.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No subscribers found"
              description="There are currently no email subscribers matching your query."
              action={
                <Button onClick={() => setIsAddOpen(true)} className="cursor-pointer font-bold">
                  <Plus className="mr-1.5 h-4 w-4" /> Add Subscriber
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground">
                    <th className="p-4 w-[35%]">Email Address</th>
                    <th className="p-4 w-[20%]">Status</th>
                    <th className="p-4 w-[25%]">Subscribed Date</th>
                    <th className="p-4 w-[20%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {subscribersList.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-bold text-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary shrink-0" />
                          <span className="truncate max-w-sm block" title={item.email}>
                            {item.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {item.is_subscribed ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                            Subscribed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">
                            <BadgeX className="h-3.5 w-3.5 text-rose-600" />
                            Unsubscribed
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 font-bold hover:bg-muted border-border/80 cursor-pointer gap-1 text-[11px]"
                            onClick={() => handleToggleSubscription(item)}
                            disabled={updateMutation.isPending}
                          >
                            {item.is_subscribed ? (
                              <>
                                <UserX className="w-3.5 h-3.5 text-amber-600" /> Unsubscribe
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Resubscribe
                              </>
                            )}
                          </Button>

                          {canDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-border/80 cursor-pointer gap-1 text-[11px]"
                              onClick={() => setDeleteTarget(item)}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && (data.previous || data.next) && (
          <Pagination
            currentPage={page}
            hasPrevious={!!data.previous}
            hasNext={!!data.next}
            onPageChange={(p) => setPage(p)}
            isPlaceholderData={isPlaceholderData}
          />
        )}
      </div>

      {/* Add Subscriber Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl mx-4 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Add New Subscriber</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddOpen(false)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="subscriber@example.com"
                  className="w-full bg-background"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                  className="h-9 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="h-9 font-bold cursor-pointer"
                >
                  {subscribeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    "Add Subscriber"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Subscriber"
        description={`Are you sure you want to delete "${deleteTarget?.email}" from the newsletter subscribers list? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
