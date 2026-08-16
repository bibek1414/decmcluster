export interface NewsletterSubscription {
  id: number;
  email: string;
  is_subscribed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNewsletterPayload {
  email: string;
}

export interface UpdateNewsletterPayload {
  email?: string;
  is_subscribed?: boolean;
}

export interface PaginatedNewsletterResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NewsletterSubscription[];
}

export interface SendEmailPayload {
  subject: string;
  body: string;
  emails: string[];
}

export interface SendEmailResponse {
  message?: string;
  detail?: string;
  status?: string;
  sent_count?: number;
  failed_emails?: string[];
  [key: string]: any;
}

