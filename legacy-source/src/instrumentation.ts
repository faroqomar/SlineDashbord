export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.NODE_ENV === 'production' && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY is missing in production environment!");
    }
  }
}
