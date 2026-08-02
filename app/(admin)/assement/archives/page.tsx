import ArchivesClient from "@/components/(admin)/archives/archives-client";

export const metadata = {
  title: "Archives | DECM Cluster Admin Portal",
  description: "View, manage, and download survey archives and tools for DECM Cluster.",
};

export default function ArchivesPage() {
  return <ArchivesClient />;
}
