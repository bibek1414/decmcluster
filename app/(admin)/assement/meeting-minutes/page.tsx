import MeetingMinutesClient from "@/components/(admin)/meeting-minutes/meeting-minutes-client";

export const metadata = {
  title: "Meeting Minutes - Admin Portal",
  description: "Upload and manage coordination meeting minutes",
};

export default function MeetingMinutesPage() {
  return <MeetingMinutesClient />;
}
