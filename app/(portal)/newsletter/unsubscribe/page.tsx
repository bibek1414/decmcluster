import type { Metadata } from "next";
import UnsubscribeForm from "@/components/newsletter/unsubscribe-form";

export const metadata: Metadata = {
  title: "Unsubscribe from Newsletter | DECM Cluster Vanuatu",
  description:
    "Unsubscribe from DECM Cluster Vanuatu email updates, situational reports, and announcements.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NewsletterUnsubscribePage() {
  return <UnsubscribeForm />;
}
