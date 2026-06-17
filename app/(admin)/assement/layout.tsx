import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessments — DECM Cluster Vanuatu",
  description: "Browse and manage all of your assessments.",
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
