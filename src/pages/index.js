import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  function handleSignIn() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fakeUser', JSON.stringify({ name: 'Recrutadora', role: 'recruiter' }));
      router.push('/dashboard');
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-indigo-50/30">
      <div className="ui-panel max-w-4xl w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-white p-8 md:p-10 flex items-center justify-center">
            <img
              src="/logotipoB.png"
              alt="Sign in illustration"
              className="max-w-full h-64 object-contain"
              onError={(e) => { e.currentTarget.src = '/logotipo.png'; }}
            />
          </div>

          <div className="bg-white p-8 md:p-10 md:border-l border-gray-200">
            <h1 className="text-2xl font-bold text-violet-600">Sign in</h1>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-700">Enter email</label>
                <div className="relative mt-2">
                  <input id="email" type="email" placeholder="email@empresa.com" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500" />
                  <span className="absolute inset-y-0 right-0 flex items-center text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 13.065 2.4 6.6A2 2 0 0 1 4 6h16c.59 0 1.13.255 1.6.6L12 13.065ZM12 15l10-7.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.5L12 15Z"/></svg>
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-700">Enter password</label>
                <div className="relative mt-2">
                  <input id="password" type="password" placeholder="********" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500" />
                  <span className="absolute inset-y-0 right-0 flex items-center text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 4.5c4.97 0 9.158 3.06 10.5 7.5-1.342 4.44-5.53 7.5-10.5 7.5S2.842 16.44 1.5 12C2.842 7.56 7.03 4.5 12 4.5Zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/></svg>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 select-none">
                  <input type="checkbox" className="accent-violet-600" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-violet-700 hover:underline">Forgot Password?</a>
              </div>

              <button type="button" className="ui-button-primary w-full py-2.5" onClick={handleSignIn}>Sign in</button>

              <div className="text-center text-sm text-gray-700">
                Don't have an account <a href="#" className="text-violet-700 hover:underline font-medium">Register here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
