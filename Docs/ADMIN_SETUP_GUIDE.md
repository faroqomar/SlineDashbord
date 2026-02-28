# 🛠️ SLine Admin Setup Guide

> [!NOTE]
> Getting started checklist and environment initialization for new developers joining the Admin Dashboard project.

## Prerequisites

1.  **Node.js**: v18.17 or newer.
2.  **npm**: v9 or newer.
3.  **Supabase CLI**: Required for generating types and managing local instances. (`brew install supabase/tap/supabase`)

## Installation

Clone the repository and install the Node modules.

```bash
git clone https://github.com/faroqomar/SlineDashbord.git
cd SlineDashbord
npm install
```

## Environment Variables

Create a `.env.local` file in the root directory.

```bash
# Public Variables
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Secret Variables (NEVER LEAK THESE)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Running Locally

Boot up the Next.js Turbopack development server.

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Deployment (Vercel)

The SLine Admin Dashboard is deployed via Vercel.

**Pre-Flight Checklist:**

1.  **Environment Variables**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set securely in the Vercel Production Environment Settings.
2.  **Build Check**: Run `npm run build` locally to verify 100% type compliance and Server Action safety.
3.  **Security Audit**: Run `npx tsc --noEmit` and check for any `any` typings creeping into the Service boundary.
