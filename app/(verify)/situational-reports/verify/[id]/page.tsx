import ReportVerifyClient from "@/components/reports/report-verify-client";

export const metadata = {
  title: "Verify Situational Report - DECM Cluster Vanuatu",
  description: "Verify and comment on uploaded situational reports",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportVerifyPage({ params }: PageProps) {
  const { id } = await params;
  return <ReportVerifyClient id={id} />;
}
