"use client";

import React from "react";
import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
export { AuthProvider } from "./AuthProvider";
export { QueryProvider } from "./QueryProvider";
