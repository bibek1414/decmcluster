import { SubscribersView } from "@/components/(admin)/newsletter/subscribers-view";

export const metadata = {
  title: "Newsletter Management | DECM Admin Portal",
  description: "View and manage email newsletter subscribers and communications.",
};

export default function NewsletterPage() {
  return <SubscribersView />;
}
