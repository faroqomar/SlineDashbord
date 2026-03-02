export interface Transaction {
  id: string;
  type: "Deposit" | "Payout" | "Fee" | "Refund";
  amount: string;
  status: "Pending" | "Cleared" | "Failed";
  date: string;
  user: {
      name: string;
      email: string;
  }
}

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 30 }, (_, i) => ({
  id: `txn_${i + 1000}`,
  type: ["Deposit", "Payout", "Fee", "Refund"][Math.floor(Math.random() * 4)] as any,
  amount: `${["Deposit", "Fee"].includes(["Deposit", "Payout", "Fee", "Refund"][Math.floor(Math.random() * 4)]) ? '+' : '-'}$${(Math.random() * 500).toFixed(2)}`,
  status: ["Pending", "Cleared", "Failed"][Math.floor(Math.random() * 3)] as any,
  date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
  user: {
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`
  }
})).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
