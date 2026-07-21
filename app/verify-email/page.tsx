import VerifyEmailClient from "@/components/auth/verify-email-client";
import { Suspense } from "react";

export const metadata = {
  title: "Verify Email - DECM Cluster Vanuatu",
  description: "Verify your email address to activate your account",
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token || "";

  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailClient token={token} />
    </Suspense>
  );
}
