# 🚀 ADMIN_SETUP_GUIDE (The Handle)

> **Goal**: Get from zero to localhost:3000 in 5 minutes.

## 🛠️ Prerequisites

- **Node.js**: v18+ (LTS recommended).
- **npm**: v9+.
- **Supabase CLI**: For type generation.

## 📥 Installation

```bash
git clone <repo-url>
cd sline_admin
npm install
```

## 🌍 Environment Variables

Create a `.env.local` file in the root directory.

```bash
# Public
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Private (Server Only - NEVER commit or expose to client)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## ▶️ Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🚢 Deployment (Vercel)

1.  **Project Settings**: Framework Preset -> Next.js.
2.  **Environment Variables**: Add all 3 variables from `.env.local`.
3.  **Build Command**: `next build` (Standard).
4.  **Install Command**: `npm install` (Standard).

> [!IMPORTANT]
> Ensure the **Production** environment variables point to the **Production** Supabase project.

---

## 🔄 Validating Setup

1.  Visit `/login`.
2.  Login with an Admin account (must exist in `admin_users` table).
3.  Verify you are redirected to `/dashboard`.
