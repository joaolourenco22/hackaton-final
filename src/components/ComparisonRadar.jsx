import React, { useMemo } from 'react';
import Radar from './Radar';

export default function ComparisonRadar({ candidates = [], selectedIds = [] }) {
  const datasets = useMemo(() => {
    const palette = ['#7c3aed', '#dc2626', '#16a34a'];

    return candidates
      .filter((c) => selectedIds.includes(c._id))
      .slice(0, 3)
      .map((c, i) => ({
        label: c.name,
        color: palette[i % palette.length],
        values: [
          c.hard_score ?? 0,
          c.soft_score ?? 0,
          c.total_score ?? 0,
        ],
      }));
  }, [candidates, selectedIds]);

  return (
    <div className="ui-panel p-4 flex flex-col items-center text-center">
      <h2 className="text-md font-semibold text-[var(--foreground)] mb-10">
        Radar de Comparação
      </h2>

      <div className="flex justify-center items-center w-full">
        <Radar
          title="Radar de Comparação"
          axes={['Hard', 'Soft', 'Total']}
          datasets={datasets}
          maxValue={100}
        />
      </div>

      <div className="text-xs text-[color:var(--text-muted)] mt-2">
        Selecione até 3 candidatos para comparar.
      </div>
    </div>
  );
}