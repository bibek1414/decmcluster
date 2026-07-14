import DisplacementImportsClient from "@/components/(admin)/displacement-imports/displacement-imports-client";

export const metadata = {
  title: "Displacement Imports - Admin Portal",
  description: "Upload and manage displacement spreadsheet imports",
};

export default function DisplacementImportsPage() {
  return <DisplacementImportsClient />;
}
