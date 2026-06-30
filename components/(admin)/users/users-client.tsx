"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Users, Trash2, X, Loader2, Eye, EyeOff, Pencil } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { useDebounce } from "@/hooks/use-debounce";
import { userService } from "@/services/user";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";
import { AlertDialog } from "@/components/ui/alert-dialog";

export default function UsersClient() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal / Add form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("viewer");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    if (newRole === "superadmin") {
      setSelectedFolders([]);
    }
  };

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; email: string } | null>(null);

  // Edit form state
  const [editTarget, setEditTarget] = useState<UserData | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editRole, setEditRole] = useState("viewer");
  const [editSelectedFolders, setEditSelectedFolders] = useState<string[]>([]);

  const handleEditClick = (item: UserData) => {
    setEditTarget(item);
    setEditFirstName(item.first_name || "");
    setEditLastName(item.last_name || "");
    setEditEmail(item.email || "");
    setEditPassword("");
    setEditRole(item.role || "viewer");
    setEditSelectedFolders(item.access_control || []);
  };

  const handleEditRoleChange = (newRole: string) => {
    setEditRole(newRole);
    if (newRole === "superadmin") {
      setEditSelectedFolders([]);
    }
  };

  // Permission Flags
  const isSuperAdmin = user?.role === "Superadmin";
  const canAdd = isSuperAdmin;
  const canDelete = isSuperAdmin;

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch Users list
  const { data, isLoading, isPlaceholderData, error } = useAdminUsers(page, token, debouncedSearch);
  const usersList = data?.results || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!firstName.trim()) throw new Error("First name is required");
      if (!lastName.trim()) throw new Error("Last name is required");
      if (!email.trim()) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");

      const payload = {
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role,
        access_control: selectedFolders,
      };

      return userService.create(payload, token);
    },
    onSuccess: () => {
      toast.success("User created successfully!");
      setIsAddOpen(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRole("viewer");
      setSelectedFolders([]);
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create user");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return userService.delete(id, token);
    },
    onSuccess: () => {
      toast.success("User deleted successfully!");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete user");
      setDeleteTarget(null);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editTarget) throw new Error("No user selected for edit");
      if (!editFirstName.trim()) throw new Error("First name is required");
      if (!editLastName.trim()) throw new Error("Last name is required");
      if (!editEmail.trim()) throw new Error("Email is required");

      const payload: Record<string, any> = {
        email: editEmail.trim(),
        first_name: editFirstName.trim(),
        last_name: editLastName.trim(),
        role: editRole,
        access_control: editSelectedFolders,
      };

      if (editPassword) {
        payload.password = editPassword;
      }

      return userService.update(editTarget.id, payload, token);
    },
    onSuccess: () => {
      toast.success("User updated successfully!");
      setEditTarget(null);
      setEditFirstName("");
      setEditLastName("");
      setEditEmail("");
      setEditPassword("");
      setEditRole("viewer");
      setEditSelectedFolders([]);
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update user");
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  const handleDelete = (id: number, email: string) => {
    setDeleteTarget({ id, email });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  const mapRoleLabel = (r: string) => {
    const roleMap: Record<string, string> = {
      superadmin: "Superadmin",
      viewer: "Viewer",
      data_enumerator: "Data Enumerator",
      field_coordinator: "Field Coordinator",
    };
    return roleMap[r] || r;
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn relative">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <PageHeader
          title="User Management"
          description={
            <div className="flex flex-col gap-0.5">
              <span>View and manage users, roles, and access credentials</span>
              {data && (
                <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                  {data.count} total records
                </span>
              )}
            </div>
          }
          actions={
            canAdd && (
              <Button onClick={() => setIsAddOpen(true)} className="cursor-pointer font-bold">
                <Plus className="mr-1.5 h-4 w-4" /> Add User
              </Button>
            )
          }
        />

        {/* Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="h-9 pl-9 w-full bg-background"
            />
          </div>
        </div>

        {/* Loading / Error / Empty / List Grid */}
        <div className="relative min-h-[200px]">
          {isLoading || isPlaceholderData ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-muted rounded-xl w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              Failed to load users: {(error as Error).message}
            </div>
          ) : usersList.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Register new staff or viewer roles to grant access to the system."
              action={
                canAdd ? (
                  <Button onClick={() => setIsAddOpen(true)} className="cursor-pointer font-bold">
                    <Plus className="mr-1.5 h-4 w-4" /> Add User
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground">
                    <th className="p-4 w-[30%]">Name</th>
                    <th className="p-4 w-[30%]">Email</th>
                    <th className="p-4 w-[15%]">Role</th>
                    <th className="p-4 w-[15%]">Folder Access</th>
                    {canDelete && <th className="p-4 w-[10%] text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {usersList.map((item) => {
                    const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.email;
                    
                    const renderAccessControlBadges = (userData: typeof item) => {
                      const roleLower = userData.role?.toLowerCase();
                      if (roleLower === "superadmin") {
                        return (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30">
                            All Folders
                          </span>
                        );
                      }
                      const ac = userData.access_control || [];
                      if (ac.length === 0) {
                        return <span className="text-muted-foreground italic font-semibold text-[10px]">None</span>;
                      }

                      const labels: Record<string, string> = {
                        "meeting-minutes": "Meeting Minutes",
                        "meeting_minutes": "Meeting Minutes",
                        "sops": "SOPs",
                        "situational-reports": "Situational Reports",
                        "situational_reports": "Situational Reports",
                      };

                      return (
                        <div className="flex flex-wrap gap-1">
                          {ac.map((val) => {
                            const normalized = val.toLowerCase().replace(/_/g, "-");
                            const label = labels[normalized] || val;
                            return (
                              <span
                                key={val}
                                className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border text-[9px] font-semibold"
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      );
                    };

                    return (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-bold text-foreground">
                          <span className="truncate max-w-xs block">{fullName}</span>
                        </td>
                        <td className="p-4 text-muted-foreground font-semibold">
                          {item.email || "—"}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white border border-primary capitalize">
                            {mapRoleLabel(item.role)}
                          </span>
                        </td>
                        <td className="p-4">
                          {renderAccessControlBadges(item)}
                        </td>
                        {canDelete && (
                          <td className="p-4 text-right">
                            <div className="inline-flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2.5 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-border/80 cursor-pointer gap-1"
                                onClick={() => handleEditClick(item)}
                              >
                                <Pencil className="w-3.5 h-3.5" /> Edit
                              </Button>
                              {/* Prevent user from deleting themselves */}
                              {user?.email !== item.email && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2.5 font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-border/80 cursor-pointer gap-1"
                                  onClick={() => handleDelete(item.id, item.email)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </Button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
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

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl mx-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Add New User</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddOpen(false)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-background"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@gmail.com"
                  className="w-full bg-background"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">User Role</label>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none cursor-pointer"
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="viewer">Viewer</option>
                  <option value="data_enumerator">Data Enumerator</option>
                  <option value="field_coordinator">Field Coordinator</option>
                </select>
              </div>

              {role !== "superadmin" && (
                <div className="space-y-2 border-t border-border/60 pt-3 mt-1">
                  <label className="block text-xs font-bold text-muted-foreground">Folder Access Control</label>
                  <p className="text-[10px] text-muted-foreground font-medium pb-1">
                    Select which directories this user is authorized to access:
                  </p>
                  <div className="space-y-2 bg-muted/30 p-3 rounded-xl border border-border/50">
                    {[
                      { id: "meeting-minutes", label: "Coordination Meeting Minutes" },
                      { id: "sops", label: "Standard Operating Procedures (SOPs)" },
                      { id: "situational-reports", label: "Situational Reports" }
                    ].map((folder) => {
                      const isChecked = selectedFolders.includes(folder.id);
                      return (
                        <label key={folder.id} className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedFolders(selectedFolders.filter((f) => f !== folder.id));
                              } else {
                                setSelectedFolders([...selectedFolders, folder.id]);
                              }
                            }}
                            className="rounded border-input text-primary focus:ring-ring h-3.5 w-3.5 cursor-pointer accent-primary"
                          />
                          <span>{folder.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {role === "superadmin" && (
                <div className="text-[10px] text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 p-2.5 rounded-xl mt-1">
                  Superadmins automatically have access to all folders.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
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
                  disabled={createMutation.isPending}
                  className="h-9 font-bold cursor-pointer"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        description={`Are you sure you want to delete the user account for "${deleteTarget?.email}"? This action will permanently revoke their access.`}
        isPending={deleteMutation.isPending}
      />

      {/* Edit User Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl mx-4 animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-foreground">Edit User</h3>
                <p className="text-[10px] text-muted-foreground font-semibold">{editTarget.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditTarget(null)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">First Name</label>
                  <Input
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-background"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">Last Name</label>
                  <Input
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">Email Address</label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="john.doe@gmail.com"
                  className="w-full bg-background"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  New Password{" "}
                  <span className="text-muted-foreground/60 font-normal">(leave blank to keep current)</span>
                </label>
                <div className="relative">
                  <Input
                    type={showEditPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                  >
                    {showEditPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">User Role</label>
                <select
                  value={editRole}
                  onChange={(e) => handleEditRoleChange(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none cursor-pointer"
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="viewer">Viewer</option>
                  <option value="data_enumerator">Data Enumerator</option>
                  <option value="field_coordinator">Field Coordinator</option>
                </select>
              </div>

              {editRole !== "superadmin" && (
                <div className="space-y-2 border-t border-border/60 pt-3 mt-1">
                  <label className="block text-xs font-bold text-muted-foreground">Folder Access Control</label>
                  <p className="text-[10px] text-muted-foreground font-medium pb-1">
                    Select which directories this user is authorized to access:
                  </p>
                  <div className="space-y-2 bg-muted/30 p-3 rounded-xl border border-border/50">
                    {[
                      { id: "meeting-minutes", label: "Coordination Meeting Minutes" },
                      { id: "sops", label: "Standard Operating Procedures (SOPs)" },
                      { id: "situational-reports", label: "Situational Reports" },
                    ].map((folder) => {
                      const isChecked = editSelectedFolders.includes(folder.id);
                      return (
                        <label key={folder.id} className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setEditSelectedFolders(editSelectedFolders.filter((f) => f !== folder.id));
                              } else {
                                setEditSelectedFolders([...editSelectedFolders, folder.id]);
                              }
                            }}
                            className="rounded border-input text-primary focus:ring-ring h-3.5 w-3.5 cursor-pointer accent-primary"
                          />
                          <span>{folder.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {editRole === "superadmin" && (
                <div className="text-[10px] text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 p-2.5 rounded-xl mt-1">
                  Superadmins automatically have access to all folders.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditTarget(null)}
                  className="h-9 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="h-9 font-bold cursor-pointer"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
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
