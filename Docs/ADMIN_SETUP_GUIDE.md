# 🚀 ADMIN_SETUP_GUIDE (The Handle)

> **Goal**: From zero to localhost in 5 minutes.

## ✅ Prerequisites

- **Node.js**: v18+
- **npm**: v9+
- **Supabase Project**: You need an active project ID and keys.

---

## 🛠️ Installation

1.  **Clone the repo**:

    ```bash
    git clone https://github.com/your-org/sline-admin.git
    cd sline-admin
    ```

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-DO-NOT-SHARE
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

---

## 🚢 Deployment (Vercel)

1.  Push to `main`.
2.  Import project in Vercel.
3.  Add Environment Variables in Vercel Project Settings.
4.  **Build Command**: `npm run build`.
5.  **Output Directory**: `.next`.

> [!IMPORTANT]
> Ensure the `SUPABASE_SERVICE_ROLE_KEY` is added to Vercel Environment Variables. The app will fail to fetch data without it.
