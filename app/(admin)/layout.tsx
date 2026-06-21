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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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

  const menuItems = [
    {
      id: "assessments",
      label: " Database",
      icon: ClipboardList,
      path: "/assement",
      active: pathname === "/assement" || pathname?.startsWith("/assement/"),
    },
    {
      id: "portal",
      label: "Go to Live Portal",
      icon: Home,
      path: "/dashboard",
      active: false,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const SidebarContent = () => (
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

        {/* Navigation Items */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 border cursor-pointer ${
                  item.active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
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
              {user?.username}
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
        <main className="flex-1 w-full bg-background min-h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
