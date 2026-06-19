import React from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/contact/contact-form";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — DECM Cluster Vanuatu",
  description:
    "Get in touch with the DECM Cluster team for feedback, questions, or system support.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="space-y-8">
        {/* Page Title Section */}
        <div className="bg-card text-card-foreground sm:rounded-2xl p-6 border border-border flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary">
                Contact & Support
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Send system inquiries, data validation reports, or coordinator feedback.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Wrapper */}
        <ContactForm />
      </div>
    </div>
  );
}
