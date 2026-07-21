import FiveWImportsClient from "@/components/(admin)/fivew-imports/fivew-imports-client";

export const metadata = {
  title: "5W Response Imports - Admin Portal",
  description: "Upload and manage 5W response activity spreadsheet imports",
};

export default function FiveWImportsPage() {
  return <FiveWImportsClient />;
}
