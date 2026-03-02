# 🚀 How to Run & Test the Migrated SLine Admin Dashboard

The project has been migrated to a modern, high-performance monorepo architecture. Follow these steps to get everything running and verified.

## 1. Prerequisites

Ensure you have the latest dependencies installed from the root:

```bash
npm install
```

## 2. Environment Setup

You need two sets of environment variables.

### API (Backend)

Create `apps/api/.env`:

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Admin UI (Frontend)

Create `apps/admin-ui/.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 3. Running the Project

### Development Mode (Both API & UI)

Run the following from the root to start both servers concurrently:

```bash
# Terminal 1: Start the API
npm run dev -w @sline/api

# Terminal 2: Start the UI
npm run dev -w @sline/admin-ui
```

- **UI**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:3001](http://localhost:3001)

---

## 4. Testing Everything

### A. Type-Safety Check

Verify that all workspaces are correctly typed:

```bash
npm run typecheck
```

### B. Unit & Integration Tests

Run Vitest for the shared logic and API:

```bash
# Root
npm run test

# Specific workspace
npm run test -w @sline/api
```

### C. End-to-End (E2E) Tests

Run Playwright tests to verify the UI flows (Dashboard, Login, etc.):

```bash
# In apps/admin-ui
npm run test:e2e
```

### D. Production Build Test

Verify that the projects build correctly for production:

```bash
# Build everything
npm run build --workspaces

# Or build individually
npm run build -w @sline/api
npm run build -w @sline/admin-ui
```

---

## 5. Deployment (Docker)

To test the production containers locally:

```bash
# Build API container
docker build -t sline-api -f apps/api/Dockerfile .

# Build UI container
docker build -t sline-ui -f apps/admin-ui/Dockerfile .
```
