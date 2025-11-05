import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RiLuggageDepositFill } from "react-icons/ri";

function IconHome() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.172 2.5 11h1.9V21a1 1 0 0 0 1 1H10v-6h4v6h4.6a1 1 0 0 0 1-1v-10h1.9L12 3.172Z"/>
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm10 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM1.5 20.5a5.5 5.5 0 0 1 11 0V22H1.5v-1.5Zm12.5 1.5v-1a4.5 4.5 0 0 1 7.5-3.536V22H14Z"/>
    </svg>
  );
}

function IconFilter() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 6h16v2H4V6Zm3 5h10v2H7v-2Zm3 5h4v2h-4v-2Z"/>
    </svg>
  );
}

function IconLuggage() {
  return (
    <RiLuggageDepositFill className="w-4 h-4" aria-hidden="true" />
  );
}

const items = [
  { label: 'Início', href: '/dashboard', icon: IconHome },
  { label: 'Candidatos', href: '/candidatos', icon: IconUsers },
  { label: 'Filtrar Candidato', href: '/filtro', icon: IconFilter },
  { label: 'Vagas', href: '/', icon: IconLuggage },
];

export default function Sidebar2() {
  const router = useRouter();

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 left-0 flex flex-col">
      <div className="ui-sidebar rounded-3xl flex-1 flex flex-col overflow-hidden">
        <div className="h-20 px-5 flex items-center border-b border-white/15">
          <Image src="/logotipoN.png" alt="EGJP Solution" width={80} height={80} />
          <span className="ml-2 font-semibold tracking-wide">DevMatch</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Sidebar">
          <ul className="space-y-2 px-3">
            {items.map((it) => {
              const ActiveIcon = it.icon;
              const active = router.pathname === it.href;
              return (
                <li key={it.label}>
                  <Link
                    href={it.href}
                    className={`group relative flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm transition-colors ${
                      active
                        ? 'bg-purple-400 text-purple-900 shadow-sm'
                        : 'text-white/90 hover:text hover:bg-white/10'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white/90">
                      <ActiveIcon />
                    </span>
                    <span className="flex-1 font-medium">{it.label}</span>
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
