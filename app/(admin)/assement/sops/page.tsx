import SOPsClient from "@/components/(admin)/sops/sops-client";

export const metadata = {
  title: "SOPs - Admin Portal",
  description: "Upload and manage standard operating procedures",
};

export default function SOPsPage() {
  return <SOPsClient />;
}
