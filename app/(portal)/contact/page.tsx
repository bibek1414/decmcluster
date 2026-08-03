import type { Metadata } from "next";
import ContactForm from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — DECM Cluster Vanuatu",
  description:
    "Get in touch with the DECM Cluster team for feedback, questions, or system support.",
};

export default function ContactPage() {
  return <ContactForm />;
}
