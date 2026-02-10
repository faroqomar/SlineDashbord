export type TicketDTO = {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low';
  category: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
  assignee?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
};

export type TicketMessageDTO = {
  id: string;
  ticket_id: string;
  sender_id: string;
  is_internal: boolean;
  content: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string | null;
  };
};
