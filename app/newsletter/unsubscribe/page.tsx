import type { Metadata } from "next";
import UnsubscribeForm from "@/components/newsletter/unsubscribe-form";

export const metadata: Metadata = {
  title: "Unsubscribe | DECM Cluster Vanuatu",
  description: "Unsubscribe from DECM Cluster Vanuatu email updates.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NewsletterUnsubscribePage() {
  return <UnsubscribeForm />;
}
