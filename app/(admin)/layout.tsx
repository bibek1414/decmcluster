import { AssessmentLayout } from "@/components/(admin)/assessment/layout/assessment-layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AssessmentLayout>{children}</AssessmentLayout>;
}
