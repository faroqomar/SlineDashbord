import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Create Supabase client
  const { supabase, response } = await createClient(request)

  // 2. Check if the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Define protected routes
  if (path.startsWith('/dashboard')) {
    // If no user, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 4. Check if user is an admin
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    // If not an admin, redirect to unauthorized
    if (error || !adminUser) {
       return NextResponse.redirect(new URL('/unauthorized', request.url)) 
    }
  }

  // 5. Redirect logged-in users away from login page
  if (path === '/login') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/login',
  ],
}
