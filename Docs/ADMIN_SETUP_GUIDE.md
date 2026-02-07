# 🚀 Admin Setup Guide (The Handle)

Follow this guide to set up the SLine Admin Dashboard locally.

---

## 📋 Prerequisites

- **Node.js**: v18 or higher (v20+ recommended).
- **npm**: Installed with Node.
- **Git**: For version control.
- **Access**: You need the `SUPABASE_SERVICE_ROLE_KEY` from the project owner.

---

## 🛠 Installation

1.  **Clone the Repository** (if you haven't)

    ```bash
    git clone <repo-url>
    cd sline_admin
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env.local` file in the root:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://isddrknbjsgaantjojhm.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
    SUPABASE_SERVICE_ROLE_KEY=<SECRET-SERVICE-ROLE-KEY>
    ```
    > [!IMPORTANT]
    > **NEVER COMMIT `.env.local`**. It contains the master key to the database.

---

## 🏃‍♂️ Running Locally

1.  **Development Server**

    ```bash
    npm run dev
    ```

    Access the app at `http://localhost:3000`.

2.  **First Login**
    If you don't have an account, run the admin creation script:
    ```bash
    node --env-file=.env.local scripts/create-admin.js
    ```
    Use credentials: `admin@sline.com` / `password123`.

---

## 🚢 Deployment

We deploy to **Vercel**.

### Checklist

1.  [ ] Push code to `main` branch.
2.  [ ] Import project in Vercel.
3.  [ ] Add Environment Variables in Vercel Project Settings.
    - **Crucial**: Add `SUPABASE_SERVICE_ROLE_KEY`.
4.  [ ] Deploy.

### Build Safety

The build pipeline runs `npm run security-check` automatically. If you imported the service key in a client component, the build **will fail**. This is a feature, not a bug.
