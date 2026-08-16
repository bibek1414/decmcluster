import { SendEmailView } from "@/components/(admin)/newsletter/send-email-view";

export const metadata = {
  title: "Send Newsletter Email | DECM Admin Portal",
  description: "Send newsletter emails to multiple recipients with rich text content.",
};

export default function AssementSendEmailPage() {
  return <SendEmailView />;
}
