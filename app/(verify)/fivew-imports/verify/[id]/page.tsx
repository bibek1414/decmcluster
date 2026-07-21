import FiveWImportVerifyClient from "@/components/fivew-imports/fivew-import-verify-client";

export const metadata = {
  title: "Verify 5W Response Import - DECM Cluster Vanuatu",
  description: "Verify and comment on uploaded 5W response import spreadsheets",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FiveWImportVerifyPage({ params }: PageProps) {
  const { id } = await params;
  return <FiveWImportVerifyClient id={id} />;
}
