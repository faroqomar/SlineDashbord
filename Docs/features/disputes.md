# Disputes Center

## Overview

Manage conflicts between Clients and Freelancers. Admins act as judges to issue refunds or enforce payouts.

## Architecture

- **Components**: `DisputeList`, `ResolutionModal`, `EvidenceGallery`, `ChatHistory`.
- **Actions**: `getDisputes`, `resolveDispute`.
- **Models**: `Dispute`.

## How It Works

1.  **Triage**: Admin views "Open" disputes.
2.  **Investigation**:
    - Review `Task` details.
    - Read Chat Logs between users.
    - View Evidence images.
3.  **Resolution**:
    - Admin selects outcome (`refund_client` / `release_fund`).
    - System updates `dispute.status` -> `resolved`.
    - System triggers Wallet transfer (Future automation).

## Future Work

- [ ] Auto-refund processing via Wallet API.
- [ ] Email notification to parties upon resolution.
