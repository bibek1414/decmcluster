import EvacuationCentreImportsClient from "@/components/(admin)/evacuation-centre-imports/evacuation-centre-imports-client";

export const metadata = {
  title: "Evacuation Centre Imports - Admin Portal",
  description: "Upload and manage evacuation centre spreadsheet imports",
};

export default function EvacuationCentreImportsPage() {
  return <EvacuationCentreImportsClient />;
}
