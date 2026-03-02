// Actually I shouldn't assume faker is installed. I'll stick to static rich data to be safe, or use a simple generator function.

export interface Evidence {
  id: string;
  name: string;
  type: "image" | "document" | "video";
  url: string;
  size: string;
  uploadedBy: "Client" | "Freelancer";
  uploadedAt: string;
  thumbnail?: string;
}

export interface TimelineEvent {
  id: string;
  type: "status_change" | "message" | "upload" | "creation" | "resolution";
  title: string;
  description?: string;
  timestamp: string;
  actor: "Client" | "Freelancer" | "Admin" | "System";
  icon?: string; // For UI mapping
}

export interface Message {
  id: string;
  sender: "Client" | "Freelancer" | "Admin" | "System";
  content: string;
  timestamp: string;
  attachments?: string[]; // IDs of evidence
  isInternal?: boolean; // For admin-only notes
}

export interface Dispute {
  id: string;
  jobId: string;
  title: string;
  amount: string;
  currency: "USD" | "EUR" | "GBP";
  status: "Open" | "Investigating" | "Mediation" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  reason: "Non-delivery" | "Quality" | "Communication" | "Other";
  description: string;
  
  client: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    rating: number;
    totalSpent: string;
  };
  
  freelancer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    rating: number;
    totalEarned: string;
  };

  evidence: Evidence[];
  timeline: TimelineEvent[];
  messages: Message[];
  
  createdAt: string;
  updatedAt: string;
  
  resolutionOptions?: {
    canRefund: boolean;
    canRelease: boolean;
    canSplit: boolean;
  };
  
  resolution?: {
    outcome: string;
    refundAmount?: string;
    resolvedBy: string;
    resolvedAt: string;
    notes?: string;
  };
}

const generateTimeline = (created: string): TimelineEvent[] => [
  {
    id: "evt_1",
    type: "creation",
    title: "Dispute Created",
    description: "Client raised a dispute regarding order #9081",
    timestamp: created,
    actor: "Client",
  },
  {
    id: "evt_2",
    type: "message",
    title: "New Message",
    description: "Freelancer replied to the dispute",
    timestamp: new Date(new Date(created).getTime() + 3600000).toISOString(),
    actor: "Freelancer",
  },
  {
    id: "evt_3",
    type: "upload",
    title: "Evidence Uploaded",
    description: "screenshot_proof.png",
    timestamp: new Date(new Date(created).getTime() + 7200000).toISOString(),
    actor: "Freelancer",
  },
   {
    id: "evt_4",
    type: "status_change",
    title: "Status Updated",
    description: "Changed from Open to Investigating",
    timestamp: new Date(new Date(created).getTime() + 10800000).toISOString(),
    actor: "Admin",
  },
];

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "dsp_001",
    jobId: "job_88219",
    title: "Logo Design Not Delivered",
    amount: "500.00",
    currency: "USD",
    status: "Investigating",
    priority: "High",
    reason: "Non-delivery",
    description: "I hired this freelancer 2 weeks ago for a simple logo design. The deadline was yesterday, and I have received nothing. They are not replying to my messages.",
    
    client: {
      id: "u_client_01",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "https://i.pravatar.cc/150?u=10",
      rating: 4.8,
      totalSpent: "$12,500",
    },
    
    freelancer: {
      id: "u_free_01",
      name: "Bob Smith",
      email: "bob.design@example.com",
      avatar: "https://i.pravatar.cc/150?u=11",
      rating: 4.2,
      totalEarned: "$4,300",
    },

    evidence: [
      {
        id: "ev_1",
        name: "chat_log.pdf",
        type: "document",
        url: "#",
        size: "1.2 MB",
        uploadedBy: "Client",
        uploadedAt: "2024-02-01T10:05:00Z"
      },
      {
        id: "ev_2",
        name: "contract_terms.pdf",
        type: "document",
        url: "#",
        size: "800 KB",
        uploadedBy: "Client",
        uploadedAt: "2024-02-01T10:06:00Z"
      },
      {
         id: "ev_3",
         name: "work_in_progress.png",
         type: "image",
         url: "https://placehold.co/600x400/png?text=WIP+Screenshot",
         thumbnail: "https://placehold.co/100x100/png?text=WIP",
         size: "2.5 MB",
         uploadedBy: "Freelancer",
         uploadedAt: "2024-02-01T12:30:00Z"
      }
    ],

    timeline: generateTimeline("2024-02-01T10:00:00Z"),
    
    messages: [
      { 
        id: "m_1", 
        sender: "Client", 
        content: "I haven't received the files yet. The deadline has passed.", 
        timestamp: "2024-02-01T10:00:00Z" 
      },
      { 
        id: "m_2", 
        sender: "Freelancer", 
        content: "I uploaded them yesterday! Please check the files tab.", 
        timestamp: "2024-02-01T10:05:00Z" 
      },
      {
        id: "m_3",
        sender: "System",
        content: "Dispute escalated to Admin Review.",
        timestamp: "2024-02-01T11:00:00Z"
      },
      {
        id: "m_4",
        sender: "Admin",
        content: "Hello, I will be handling this case. @Freelancer, please provide proof of submission.",
        timestamp: "2024-02-01T11:30:00Z",
        isInternal: false
      }
    ],

    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T14:00:00Z",
    
    resolutionOptions: {
      canRefund: true,
      canRelease: false, // Work not proven
      canSplit: true,
    }
  },
  {
    id: "dsp_002",
    jobId: "job_77321",
    title: "Poor Quality Code",
    amount: "1,200.00",
    currency: "USD",
    status: "Mediation",
    priority: "Medium",
    reason: "Quality",
    description: "The delivered React components are not responsive and crash on mobile devices. This is not what was agreed upon in the specification.",
    
    client: {
      id: "u_client_02",
      name: "TechStart Inc",
      email: "cto@techstart.io",
      avatar: "https://i.pravatar.cc/150?u=20",
      rating: 5.0,
      totalSpent: "$45,000",
    },
    
    freelancer: {
      id: "u_free_02",
      name: "Dev Wizard",
      email: "wizard@code.com",
      avatar: "https://i.pravatar.cc/150?u=21",
      rating: 4.9,
      totalEarned: "$82,000",
    },

    evidence: [
      {
        id: "ev_4",
        name: "mobile_crash_video.mp4",
        type: "video",
        url: "#",
        size: "15 MB",
        uploadedBy: "Client",
        uploadedAt: "2024-02-02T09:15:00Z"
      }
    ],

    timeline: generateTimeline("2024-02-02T09:00:00Z"),
    
    messages: [
       { 
        id: "m_5", 
        sender: "Client", 
        content: "Look at this video. The app crashes immediately on iOS.", 
        timestamp: "2024-02-02T09:15:00Z" 
      },
      { 
        id: "m_6", 
        sender: "Freelancer", 
        content: "It works fine on my simulator. Are you using the latest build?", 
        timestamp: "2024-02-02T09:45:00Z" 
      }
    ],

    createdAt: "2024-02-02T09:00:00Z",
    updatedAt: "2024-02-02T10:00:00Z",
    
    resolutionOptions: {
      canRefund: true,
      canRelease: true,
      canSplit: true,
    }
  },
  {
    id: "dsp_003",
    jobId: "job_55112",
    title: "Unresponsive Freelancer",
    amount: "2,500.00",
    currency: "USD",
    status: "Resolved",
    priority: "Low",
    reason: "Non-delivery",
    description: "Freelancer stopped replying 3 weeks ago.",
    
    client: {
      id: "u_client_03",
      name: "Eve Polastri",
      email: "eve@mi6.uk",
      avatar: "https://i.pravatar.cc/150?u=14",
      rating: 4.5,
      totalSpent: "$8,200",
    },
    
    freelancer: {
      id: "u_free_03",
      name: "Villanelle",
      email: "oxana@organization.ru",
      avatar: "https://i.pravatar.cc/150?u=15",
      rating: 3.8,
      totalEarned: "$120,000",
    },

    evidence: [],
    timeline: generateTimeline("2024-01-28T08:00:00Z"),
    messages: [],

    createdAt: "2024-01-28T08:00:00Z",
    updatedAt: "2024-02-05T16:00:00Z",
    
    resolutionOptions: {
      canRefund: false,
      canRelease: false,
      canSplit: false,
    },
    
    resolution: {
       outcome: "Refunded",
       refundAmount: "2,500.00",
       resolvedBy: "Admin",
       resolvedAt: "2024-02-05T16:00:00Z",
       notes: "Freelancer AWOL. Full refund issued."
    }
  }
];
