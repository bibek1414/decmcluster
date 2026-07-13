import AssessmentDetailClient from "@/components/(admin)/assessment/details/assessment-detail-client";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const formattedTitle = id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} | Decmcluster`,
    description: `Detailed view and administration controls for ${formattedTitle} dataset.`,
  };
}

export default async function AssessmentDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <AssessmentDetailClient slug={resolvedParams.id} />;
}
