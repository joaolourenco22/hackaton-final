import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar2";

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen ui-shell flex">
      <Sidebar />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
