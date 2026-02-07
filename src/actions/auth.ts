'use server';

import { redirect } from 'next/navigation';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// We need a way to create a client that sets cookies for the browser session.
// The existing @/lib/supabase/admin.ts is for ADMIN role and doesn't handle user session cookies the same way 
// (or rather, it uses the Service ID, which we don't want for the session itself initially, 
// strictly speaking we log in as a user).
// However, since this is an Admin App, maybe we just want to verify credentials.
// Standard Supabase Auth flow:

async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createAuthClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect('/login');
}
