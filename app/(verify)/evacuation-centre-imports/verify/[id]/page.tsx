import EvacuationCentreImportVerifyClient from "@/components/evacuation-centre-imports/evacuation-centre-import-verify-client";

export const metadata = {
  title: "Verify Evacuation Centre Import - DECM Cluster Vanuatu",
  description: "Verify and comment on uploaded evacuation centre import spreadsheets",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EvacuationCentreImportVerifyPage({ params }: PageProps) {
  const { id } = await params;
  return <EvacuationCentreImportVerifyClient id={id} />;
}
