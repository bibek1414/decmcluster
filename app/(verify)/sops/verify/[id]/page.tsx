import SOPVerifyClient from "@/components/sops/sop-verify-client";

export const metadata = {
  title: "Verify SOP Document - DECM Cluster Vanuatu",
  description: "Verify and comment on uploaded standard operating procedures",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SOPVerifyPage({ params }: PageProps) {
  const { id } = await params;
  return <SOPVerifyClient id={id} />;
}
