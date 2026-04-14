import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

/**
 * Next.js 16 uses "proxy" (not "middleware").
 * This keeps the Supabase session cookie alive on every request.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Public images / fonts
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
