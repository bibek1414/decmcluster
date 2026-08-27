export interface ClusterContactItem {
  id: number;
  name: string;
  email: string;
  organization: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedClusterContactResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClusterContactItem[];
}

export interface CreateClusterContactPayload {
  name: string;
  email: string;
  organization: string;
}

export interface SendClusterContactEmailPayload {
  subject: string;
  body: string;
  emails?: string[];
  send_to_all?: boolean;
}

export interface SendClusterContactEmailResponse {
  message?: string;
  sent_count?: number;
  detail?: string;
}
