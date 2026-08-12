import type { Metadata } from "next";
import ContactForm from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact & Secretariat Focal Points",
  description:
    "Get in touch with the DECM Cluster Vanuatu focal points, National Disaster Management Office (NDMO), IOM Vanuatu, and disaster management coordinators.",
  keywords: [
    "Contact DECM Cluster",
    "NDMO Vanuatu Focal Points",
    "IOM Vanuatu Contact",
    "Displacement Cluster Secretariat",
  ],
  openGraph: {
    title: "Contact & Secretariat Focal Points | DECM Cluster Vanuatu",
    description:
      "Get in touch with the DECM Cluster Vanuatu focal points, National Disaster Management Office (NDMO), IOM Vanuatu, and disaster management coordinators.",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
