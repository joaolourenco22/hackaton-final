import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar2";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Read session user
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('fakeUser');
    try { setUser(raw ? JSON.parse(raw) : null); } catch { setUser(null); }
  }, [router.pathname]);

  // Route guard: only '/' is public (login)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isLogged = !!localStorage.getItem('fakeUser');
    const publicRoutes = ['/'];
    const path = router.pathname;
    if (!isLogged && !publicRoutes.includes(path)) {
      router.replace('/');
    }
  }, [router.pathname]);

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fakeUser');
      setUser(null);
      router.push('/');
    }
  }

  // Dark mode automático via CSS (sem botão/toggle)

  const isPublic = router.pathname === '/';

  if (isPublic) {
    // Login page without app chrome
    return <Component {...pageProps} />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-50 to-indigo-50/30 text-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        {user && (
          <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 border-b bg-violet-500 rounded-2xl mx-24">
            <div className="text-4xl text-white"><span className="font-bold">Bem-vindo!</span></div>
            <button onClick={logout} className="text-xs text-white/90 hover:text-white underline">Sair</button>
          </div>
        )}
        <Component {...pageProps} />
      </main>
    </div>
  );
}
