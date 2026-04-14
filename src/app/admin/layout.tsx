import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

/**
 * Server-side layout guard for /admin.
 * Reads the session & profile role without any client-side code.
 * Unauthenticated users → /login
 * Authenticated customers → / (home)
 * Admins → allowed through
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Cast to the known shape — TypeScript can struggle inferring through generic chains
  const profile = data as { role: 'admin' | 'customer' } | null;

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}

