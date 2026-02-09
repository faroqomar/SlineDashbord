# Finance Treasury

## Overview

Monitor platform cash flow, wallet transactions, and total revenue.

## Architecture

- **Components**: `RevenueChart`, `TransactionTable`, `PayoutList`.
- **Actions**: `getTransactions`, `getRevenueStats`.
- **Models**: `Transaction`.

## How It Works

1.  **Data Fetching**: Queries `wallet_transactions` table.
2.  **Aggregates**: Calculates Total Volume, Platform Fees, and Pending Payouts on read.
3.  **Visualization**: Renders Recharts area graph for monthly trends.

## Future Work

- [ ] Manual Payout approval workflow.
- [ ] Stripe/Payment Gateway integration logs.
