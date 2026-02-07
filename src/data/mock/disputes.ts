export interface Message {
  id: string;
  sender: "Client" | "Freelancer" | "Admin";
  content: string;
  timestamp: string;
}

export interface Dispute {
  id: string;
  jobId: string;
  client: {
    name: string;
    avatar?: string;
  };
  freelancer: {
    name: string;
    avatar?: string;
  };
  amount: string;
  status: "Open" | "Investigating" | "Resolved";
  reason: string;
  messages: Message[];
  createdAt: string;
}

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "dsp_001",
    jobId: "job_12345",
    client: { name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=10" },
    freelancer: { name: "Bob Smith", avatar: "https://i.pravatar.cc/150?u=11" },
    amount: "$500.00",
    status: "Open",
    reason: "Project not delivered on time",
    createdAt: "2024-02-01",
    messages: [
      { id: "m1", sender: "Client", content: "I haven't received the files yet.", timestamp: "10:00 AM" },
      { id: "m2", sender: "Freelancer", content: "I uploaded them yesterday!", timestamp: "10:05 AM" },
    ],
  },
  {
    id: "dsp_002",
    jobId: "job_67890",
    client: { name: "Charlie Brown", avatar: "https://i.pravatar.cc/150?u=12" },
    freelancer: { name: "Diana Prince", avatar: "https://i.pravatar.cc/150?u=13" },
    amount: "$120.00",
    status: "Investigating",
    reason: "Low quality work",
    createdAt: "2024-02-02",
    messages: [
      { id: "m3", sender: "Client", content: "The logo looks pixelated.", timestamp: "2:00 PM" },
      { id: "m4", sender: "Freelancer", content: "I sent the vector file.", timestamp: "2:10 PM" },
      { id: "m5", sender: "Admin", content: "Investigating the file formats now.", timestamp: "2:30 PM" },
    ],
  },
  {
    id: "dsp_003",
    jobId: "job_54321",
    client: { name: "Eve Polastri", avatar: "https://i.pravatar.cc/150?u=14" },
    freelancer: { name: "Villanelle", avatar: "https://i.pravatar.cc/150?u=15" },
    amount: "$2500.00",
    status: "Resolved",
    reason: "Unresponsive freelancer",
    createdAt: "2024-01-28",
    messages: [],
  },
];
