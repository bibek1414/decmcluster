import VillageAssessmentImportsClient from "@/components/(admin)/village-assessment-imports/village-assessment-imports-client";

export const metadata = {
  title: "Village Assessment Imports - Admin Portal",
  description: "Upload and manage village assessment spreadsheet imports",
};

export default function VillageAssessmentImportsPage() {
  return <VillageAssessmentImportsClient />;
}
