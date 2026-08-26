import { ClusterContactsView } from "@/components/(admin)/newsletter/cluster-contacts-view";

export const metadata = {
  title: "Cluster Contact List | DECM Admin Portal",
  description: "View and manage DECM Cluster stakeholder directory and mailing list contacts.",
};

export default function AssementClusterContactsPage() {
  return <ClusterContactsView />;
}
