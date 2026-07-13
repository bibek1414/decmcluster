"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  Home,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  FileText,
  BookOpen,
  FileSpreadsheet,
  Users,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // useMemo MUST be called before any early return to satisfy Rules of Hooks
  const hasPathAccess = React.useMemo(() => {
    if (!user) return false;
    const roleLower = user.role?.toLowerCase();
    if (roleLower === "superadmin") return true;

    const acList = user.access_control || [];
    const normalized = acList.map((item: string) => item.toLowerCase().replace(/_/g, "-"));

    if (pathname?.startsWith("/assement/meeting-minutes")) {
      return normalized.includes("meeting-minutes");
    }
    if (pathname?.startsWith("/assement/sops")) {
      return normalized.includes("sops");
    }
    if (pathname?.startsWith("/assement/situational-reports")) {
      return normalized.includes("situational-reports");
    }
    if (pathname?.startsWith("/assement/users")) {
      return false;
    }
    if (pathname?.startsWith("/assement/tools")) {
      return roleLower === "data enumerator" || roleLower === "field coordinator";
    }
    // Guard for specific assessment slug details pages
    if (pathname?.startsWith("/assement/")) {
      const rest = pathname.substring("/assement/".length);
      if (rest && !rest.includes("/")) {
        return normalized.includes(rest.toLowerCase());
      }
    }
    return true;
  }, [pathname, user]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/");
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-24 animate-fadeIn">
        <div className="flex flex-col items-center gap-3 bg-card border border-border p-8 rounded-2xl shadow-sm">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-xs text-muted-foreground font-semibold">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Redirects via useEffect
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const SidebarContent = () => {
     const isSuperAdmin = user?.role === "Superadmin";
     const isDataEnumerator = user?.role === "Data Enumerator";
     const isFieldCoordinator = user?.role === "Field Coordinator";
     const ac = user?.access_control || [];
     const normalizedAc = ac.map((item: string) => item.toLowerCase().replace(/_/g, "-"));
 
     const showMeetingMinutes = isSuperAdmin || normalizedAc.includes("meeting-minutes");
     const showSops = isSuperAdmin || normalizedAc.includes("sops");
     const showTools = isSuperAdmin || isDataEnumerator || isFieldCoordinator;
     const showSituationalReports = isSuperAdmin || normalizedAc.includes("situational-reports");
     const showUserManagement = isSuperAdmin;
 
     return (
       <div className="h-full flex flex-col justify-between p-5">
         <div className="space-y-6">
           {/* Logo and Brand */}
           <div className="flex items-center gap-3 pb-4 border-b border-border">
             <Logo className="w-10 h-10" />
             <div className="min-w-0">
               <h2 className="text-xs font-extrabold text-foreground leading-tight tracking-tight uppercase">
                 DECM Cluster
               </h2>
               <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                 Admin Portal
               </p>
             </div>
           </div>
 
           {/* Navigation Groups */}
           <div className="space-y-5">
             {/* Database Group */}
             <div className="space-y-1.5">
               <p className="px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                 Database
               </p>
               <Link
                 href="/assement"
                 onClick={() => setIsMobileMenuOpen(false)}
                 className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 border cursor-pointer ${
                   pathname === "/assement" || (
                     pathname?.startsWith("/assement/") &&
                     !pathname.startsWith("/assement/meeting-minutes") &&
                     !pathname.startsWith("/assement/sops") &&
                     !pathname.startsWith("/assement/situational-reports") &&
                     !pathname.startsWith("/assement/users") &&
                     !pathname.startsWith("/assement/tools")
                   )
                     ? "bg-primary text-primary-foreground border-primary"
                     : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                 }`}
               >
                 <ClipboardList className="h-4 w-4 shrink-0" />
                 <span>Displacement Data</span>
               </Link>
             </div>
 
             {/* Coordination Group */}
             {(showMeetingMinutes || showSops || showTools) && (
               <div className="space-y-1.5">
                 <p className="px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                   Coordination
                 </p>
                 {showMeetingMinutes && (
                   <Link
                     href="/assement/meeting-minutes"
                     onClick={() => setIsMobileMenuOpen(false)}
                     className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 border cursor-pointer ${
                       pathname?.startsWith("/assement/meeting-minutes")
                         ? "bg-primary text-primary-foreground border-primary"
                         : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                     }`}
                   >
                     <FileText className="h-4 w-4 shrink-0" />
                     <span>Meeting Minutes</span>
                   </Link>
                 )}
                 {showSops && (
                   <Link
                     href="/assement/sops"
                     onClick={() => setIsMobileMenuOpen(false)}
                     className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 border cursor-pointer ${
                       pathname?.startsWith("/assement/sops")
                         ? "bg-primary text-primary-foreground border-primary"
                         : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                     }`}
                   >
                     <BookOpen className="h-4 w-4 shrink-0" />
                     <span>SOPs</span>
                   </Link>
                 )}
                 {showTools && (
                   <Link
                     href="/assement/tools"
                     onClick={() => setIsMobileMenuOpen(false)}
                     className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 border cursor-pointer ${
                       pathname?.startsWith("/assement/tools")
                         ? "bg-primary text-primary-foreground border-primary"
                         : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                     }`}
                   >
                     <Wrench className="h-4 w-4 shrink-0" />
                     <span>Tools</span>
                   </Link>
                 )}
               </div>
             )}

            {/* Reports Group */}
            {showSituationalReports && (
              <div className="space-y-1.5">
                <p className="px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Reports
                </p>
                <Link
                  href="/assement/situational-reports"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 border cursor-pointer ${
                    pathname?.startsWith("/assement/situational-reports")
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4 shrink-0" />
                  <span>Situational Reports</span>
                </Link>
              </div>
            )}

            {/* System Group */}
            {showUserManagement && (
              <div className="space-y-1.5">
                <p className="px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  System
                </p>
                <Link
                  href="/assement/users"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 border cursor-pointer ${
                    pathname?.startsWith("/assement/users")
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                  }`}
                >
                  <Users className="h-4 w-4 shrink-0" />
                  <span>User Management</span>
                </Link>
              </div>
            )}

            {/* Live Portal Link */}
            <div className="pt-2 border-t border-border/40">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent cursor-pointer"
              >
                <Home className="h-4 w-4 shrink-0" />
                <span>Go to Live Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* User profile & Logout */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-muted/40 border border-border">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground">
                {user?.email}
              </p>
              <p className="truncate text-[10px] text-muted-foreground font-semibold">
                {user?.role}
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-xs font-bold gap-1.5 h-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-border cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-card border-r border-border shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <Logo className="w-8 h-8" />
            <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">
              DECM Admin
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </header>

        {/* Mobile Sidebar overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/45 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Sidebar content drawer */}
            <aside className="relative flex-1 max-w-[280px] w-full bg-card h-full border-r border-border flex flex-col animate-slideRight">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 w-full bg-background min-h-full flex flex-col">
          {hasPathAccess ? (
            children
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fadeIn min-h-[400px]">
              <div className="bg-card border border-border p-8 rounded-2xl max-w-md w-full space-y-4 shadow-sm m-4">
                <div className="mx-auto w-12 h-12 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground">Access Denied</h3>
                  <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                    You do not have permission to access this module. Please contact your system administrator to request access.
                  </p>
                </div>
                <Button asChild className="w-full text-xs font-bold cursor-pointer h-9 mt-2">
                  <Link href="/assement">
                    Go to Displacement Data
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
