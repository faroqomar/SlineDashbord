export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
  metadata?: Record<string, any>;
  diff?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
}

export const MOCK_LOGS: LogEntry[] = Array.from({ length: 50 }, (_, i) => {
  const level = Math.random() > 0.8 ? "ERROR" : Math.random() > 0.6 ? "WARN" : "INFO";
  const services = ["Auth Service", "Payment Gateway", "User Manager", "Database", "File Storage"];
  const messages = {
    INFO: ["User updated profile", "Payment processed", "File uploaded", "Settings changed"],
    WARN: ["High latency detected", "Rate limit approaching", "Invalid login attempt", "Disk usage warning"],
    ERROR: ["Database connection failed", "Payment gateway timeout", "Unhandled script exception", "Critical failure"]
  };

  const hasDiff = level === "INFO" && Math.random() > 0.7;
  
  const diff = hasDiff ? {
      before: {
          status: "pending",
          role: "user",
          email_verified: false
      },
      after: {
          status: "active",
          role: "moderator",
          email_verified: true
      }
  } : undefined;

  return {
    id: `log_${Date.now()}_${i}`,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    level: level as "INFO" | "WARN" | "ERROR",
    service: services[Math.floor(Math.random() * services.length)],
    message: messages[level as keyof typeof messages][Math.floor(Math.random() * 4)],
    metadata: Math.random() > 0.7 ? { userId: `user_${Math.floor(Math.random() * 100)}`, ip: "192.168.1.1" } : undefined,
    diff,
  };
});
