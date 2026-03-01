# Admin Setup Guide

Welcome to the Sline engineering team. This guide covers how to set up the Sline Platform Admin Dashboard (Next.js 15) locally and what to look out for during the Vercel deployment cycle.

---

## ⚙️ Prerequisites

Before you clone the repository, ensure your local development machine has the following tools installed globally:

- **Node.js**: `v20.x` or higher (Mandatory for Next.js App Router).
- **npm** or **pnpm**: The package manager of choice.
- **Supabase CLI** _(Optional, but recommended)_: For interacting with database migrations and generating fresh TypeScript types locally.

---

## 🚀 Local Installation

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd SlineDashbord
   ```

2. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

3. **Establish Local Environment Variables:**
   Create a `.env.local` file at the root directory of the dashboard. Use the template below, but ping the lead engineering discord for the actual secret keys.

   ```env
   # .env.local

   # The Supabase Project URL mappings
   NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_INSTANCE].supabase.co

   # Required for standard login capabilities
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...

   # CRITICAL SECRETS - DO NOT LEAK
   # Used by Server Actions to bypass RLS and act as the Admin System
   SUPABASE_SERVICE_ROLE_KEY=eyJh...
   ```

4. **Boot the standard Next.js Dev Server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000`. Turbopack handles your compilation. If you experience massive memory spikes or Next.js crashes due to "corrupted index bounds", gracefully run `rm -rf .next` and restart.

---

## 🚀 Deployment (Vercel)

The Sline Dashboard is configured to deploy aggressively and scale infinitely on the Edge via Vercel.

**Vercel Checklist:**

- [ ] Connect the GitHub repository branch (`main` for production, `dev` for staging/preview).
- [ ] Map the Framework Preset to `Next.js`.
- [ ] Set all Environment Variables from the `.env.local` inside the Vercel Settings portal. (Ensure `SUPABASE_SERVICE_ROLE_KEY` is completely identical!).
- [ ] Ensure the Build Command is `npm run build`.

> [!IMPORTANT]
> Because Server Actions are computationally heavy (e.g., running `logAuditEvent`, modifying user profiles over the Service Role token, and calculating huge aggregation queries), Vercel Serverless Function Timeouts might be triggered if not given enough execution time padding. Keep an eye on the `Vercel Logs`.
