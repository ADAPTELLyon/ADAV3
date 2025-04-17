import { ReactNode } from 'react';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'ADAPTEL Lyon',
};

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies(); // Résolution nécessaire pour les cookies

  // Adapter les cookies pour respecter les types attendus par Supabase
  const adaptedCookies = {
    get: (name: string) => cookieStore.get(name)?.value ?? null,
    getAll: () =>
      cookieStore.getAll().map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
      })),
  };

  const supabase = createServerClient(
    'https://oepcghxcurclerakdorz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcGNnaHhjdXJjbGVyYWtkb3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NTk0ODcsImV4cCI6MjA1OTMzNTQ4N30.BNzOBDWiMzvxG9X9-yw6xNPDTEkqaDrLJxQeo-t2i30',
    { cookies: adaptedCookies }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const userEmail = session?.user?.email ?? 'Utilisateur';

  return (
    <div className="bg-gray-50 text-gray-900">
      <header className="bg-gradient-to-r from-[#840404] to-[#b30000] shadow-md px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white text-xl">ADAPTEL Lyon</span>
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href="/commandes" className="text-white hover:underline transition-all">Commandes</Link>
            <Link href="/planning" className="text-white hover:underline transition-all">Planning</Link>
            <Link href="/clients" className="text-white hover:underline transition-all">Clients</Link>
            <Link href="/candidats" className="text-white hover:underline transition-all">Candidats</Link>
            <Link href="/parametrages" className="text-white hover:underline transition-all">Paramétrages</Link>
          </nav>
          <div className="flex items-center gap-2 text-sm text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" />
            </svg>
            <span>{userEmail}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
