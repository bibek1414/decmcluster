import VillageAssessmentImportVerifyClient from "@/components/village-assessment-imports/village-assessment-import-verify-client";

export const metadata = {
  title: "Verify Village Assessment Import - DECM Cluster Vanuatu",
  description: "Verify and comment on uploaded village assessment import spreadsheets",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VillageAssessmentImportVerifyPage({ params }: PageProps) {
  const { id } = await params;
  return <VillageAssessmentImportVerifyClient id={id} />;
}
