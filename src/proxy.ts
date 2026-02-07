import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  // 1. Initialize Supabase Client
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
            return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
            response = NextResponse.next({
                request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
            );
        },
      },
    }
  );

  // 2. Refresh Session
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Define Protected Routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // 3.1 Check for active session
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3.2 Check for Admin Email or Role
    // Assuming admin email domain is @sline.com
    const email = user.email || '';
    if (!email.endsWith('@sline.com') && user.app_metadata?.provider !== 'service_role') {
        // Option: Redirect to unauthorized page or show error
        // For MVP, redirect to login with error param? Or just stick to login.
        // Let's create a simple unauthorized response or redirect to home.
        return NextResponse.redirect(new URL('/login?error=Unauthorized Access', request.url));
    }
  }
  
  // 4. Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/login') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes, if we want to exclude them, usually good to include key routes though)
     */
    '/dashboard/:path*',
    '/login',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
