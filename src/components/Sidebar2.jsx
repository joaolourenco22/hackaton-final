import React from 'react';
import Image from 'next/image';

const items = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Candidatos', href: '/candidatos' },
  { label: 'Filtrar Candidato', href: '/filtro'},
];

export default function Sidebar2() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col p-3">
      <div className="ui-sidebar rounded-3xl flex-1 flex flex-col overflow-hidden">
        <div className="h-20 px-5 flex items-center gap-3 border-b border-white/15">
          <Image src="/logotipoN.png"  alt="EGJP Solution" width={88} height={88} />
          <span className="font-semibold">DevMatch</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Sidebar">
          <ul className="space-y-1 px-3">
            {items.map((it) => (
              <li key={it.label}>
                <a href={it.href} className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" aria-hidden="true" />
                  <span>{it.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

