import DisplacementImportVerifyClient from "@/components/displacement-imports/displacement-import-verify-client";

export const metadata = {
  title: "Verify Displacement Import - DECM Cluster Vanuatu",
  description: "Verify and comment on uploaded displacement import spreadsheets",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DisplacementImportVerifyPage({ params }: PageProps) {
  const { id } = await params;
  return <DisplacementImportVerifyClient id={id} />;
}
