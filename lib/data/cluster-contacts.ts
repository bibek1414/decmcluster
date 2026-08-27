export interface ClusterContact {
  id: string;
  name: string;
  email: string;
  organization: string;
}

export function formatDisplayName(contact: { name?: string | null; email?: string | null }): string {
  if (contact.name && contact.name.trim()) {
    return contact.name.trim();
  }
  const emailStr = contact.email || "";
  const username = emailStr.split("@")[0] || "";
  return (
    username
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim() || "Contact"
  );
}

export function getOrganizationBadgeClass(): string {
  return "bg-muted/70 text-foreground border-border font-medium";
}

export const CLUSTER_CONTACTS: ClusterContact[] = [];
