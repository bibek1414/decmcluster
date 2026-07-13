import { AssessmentsClient } from "@/components/(admin)/assessment/assessments-client";

export const metadata = {
  title: "Displacement Data & Forms | Decmcluster",
  description: "Access templates, schemas, and live interactive datasets for displacement and evacuation tracking.",
};

export default function AssessmentsPage() {
  return <AssessmentsClient />;
}
