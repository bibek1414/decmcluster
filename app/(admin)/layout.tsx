"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/");
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12 animate-fadeIn">
        <div className="flex flex-col items-center gap-3 bg-card border border-border p-8 rounded-2xl shadow-sm">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-xs text-muted-foreground font-semibold">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Redirects via useEffect
  }

  return <>{children}</>;
}
