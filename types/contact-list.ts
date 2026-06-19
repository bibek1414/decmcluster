export interface ContactListData {
  id: number;
  name: string;
  organization: string;
  type: "National Co-lead" | "Sub-National" | "Inter-Cluster";
  cluster?: string | null;
  phone?: string | null;
  email: string;
  order: number;
  created_at: string;
  updated_at: string;
}
