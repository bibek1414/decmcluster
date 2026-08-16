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
