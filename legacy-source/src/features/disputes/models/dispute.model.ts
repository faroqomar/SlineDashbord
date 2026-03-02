export interface Dispute {
  id: string;
  task_id: string;
  initiator_id: string;
  respondent_id: string;
  reason: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  resolution?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  initiator?: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  task?: {
    title: string;
    description: string;
    budget: number;
    status: string;
  };
  messages?: any[]; // Typing these would require Message model
  evidence?: any[]; // Typing these would require Evidence model
}

export interface DisputeListResult {
  disputes: Dispute[];
  total: number;
  totalPages: number;
}
