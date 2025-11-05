import React from 'react';

export default function Ranking({ candidates = [], selectedIds = [], onToggleSelect, activeId, onActiveChange }) {
  return (
    <div className="ui-panel p-2 overflow-y-auto max-h-[420px]">
      <table className="min-w-full w-full table-auto text-sm">
        <thead className="sticky top-0 z-10 bg-gray-50">
          <tr className="text-left text-gray-800 text-xs uppercase tracking-wide">
            <th className="p-2">Comparar</th>
            <th className="p-2">Nome</th>
            <th className="p-2">Role</th>
            <th className="p-2">Hard</th>
            <th className="p-2">Soft</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => {
            const checked = selectedIds.includes(c._id);
            return (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  <input
                    aria-label={`Selecionar ${c.name} para comparação`}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleSelect(c._id)}
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => onActiveChange(c._id)}
                    className={`underline-offset-2 hover:underline ${activeId === c._id ? 'font-semibold text-violet-700' : ''}`}
                  >
                    {c.name}
                  </button>
                </td>
                <td className="p-2">{c.role}</td>
                <td className="p-2">{Math.round(c.hard_score)}</td>
                <td className="p-2">{c.soft_score ? Math.round(c.soft_score) : '—'}</td>
                <td className="p-2">{c.total_score ? Math.round(c.total_score) : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
