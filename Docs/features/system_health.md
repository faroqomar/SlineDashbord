# System Health & Logs

## Overview

Live monitoring of system events, errors, and audit logs.

## Architecture

- **Components**: `LogsTerminal` (Client), `AuditLogTable`.
- **Actions**: `getSystemLogs`.
- **Models**: Log Entry Interface.

## How It Works

1.  **Stream**: Reads from server-side log files or `admin_logs` database table.
2.  **Terminal View**: Displays raw text logs for debugging.
3.  **Filtering**: Filter by Log Level (Info, Warn, Error).

## Future Work

- [ ] Real-time WebSocket connection for live log streaming.
- [ ] Export logs to CSV.
