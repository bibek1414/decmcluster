import MeetingMinuteVerifyClient from "@/components/meeting-minutes/meeting-minute-verify-client";

export const metadata = {
  title: "Verify Meeting Minute - DECM Cluster Vanuatu",
  description: "Verify and comment on uploaded coordination meeting minutes",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingMinuteVerifyPage({ params }: PageProps) {
  const { id } = await params;
  return <MeetingMinuteVerifyClient id={id} />;
}
