import React from 'react';

function KPI({ label, value }) {
  const display =
    value === null || value === undefined || value === '' ? '-' : value;
  return (
    <div className="ui-panel p-4 border-l-4 border-l-violet-500/70 hover:shadow-md transition-shadow">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-3xl font-bold text-gray-900" aria-label={label}>
        {display}
      </div>
    </div>
  );
}

export default function KPIs({ kpis, jobsCount }) {
  const avgHard =
    typeof kpis?.average_hard === 'number'
      ? kpis.average_hard.toFixed(1)
      : undefined;
  const avgSoft =
    typeof kpis?.average_soft === 'number'
      ? kpis.average_soft.toFixed(1)
      : undefined;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      <KPI label="Candidatos" value={kpis?.count} />
      <KPI label="Vagas" value={jobsCount} />
      <KPI label="Media Hard" value={avgHard} />
    </section>
  );
}
