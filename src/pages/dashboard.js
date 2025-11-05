import { useEffect, useMemo, useState } from 'react';
import { fetchCandidates, fetchKPIs, seed } from '@/services/api';
import CandidateCard from '@/components/CandidateCard';
import Filters from '@/components/Filters';
import KPIs from '@/components/KPIs';
import IndividualPanel from '@/components/IndividualPanel';
import ComparisonRadar from '@/components/ComparisonRadar';
import Ranking from '@/components/Ranking';

export default function Home() {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    location: '',
    min_hard: '',
    min_soft: '',
  });
  const [weightHard, setWeightHard] = useState(0.6);
  const [candidates, setCandidates] = useState([]);
  const [kpis, setKpis] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const params = { ...filters, weight_hard: weightHard, sort_by: 'total', order: 'desc', limit: 50 };
      const [list, kpiData] = await Promise.all([fetchCandidates(params), fetchKPIs(params)]);
      setCandidates(list);
      setKpis(kpiData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await loadAll();
        if (!candidates.length) {
          await seed(true);
          await loadAll();
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    loadAll();
  }, [weightHard]);

  const activeCandidate = useMemo(
    () => candidates.find((c) => c._id === activeId),
    [candidates, activeId]
  );

  function onToggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= 3
          ? [...prev.slice(1), id]
          : [...prev, id]
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPIs topo */}
        <KPIs kpis={kpis} jobsCount={0} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm text-gray-700">Top Candidatos</h2>
              <a href="/candidatos" className="text-xs text-violet-700 hover:underline">Ver todos</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {candidates.slice(0, 6).map((c, i) => (
                <CandidateCard key={c._id} candidate={c} index={i} onClick={() => setActiveId(c._id)} />
              ))}
            </div>
          </section>

          <section className="lg:col-span-1 ui-panel p-4">
            <h2 className="text-sm text-gray-700 mb-2">Radar Individual (Soft Skills)</h2>
            <IndividualPanel candidate={activeCandidate} />
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm text-gray-700">Ranking e Seleção para Comparar</h2>
              <div className="ui-chip text-xs">Selecione até 3</div>
            </div>
            <Ranking
              candidates={candidates}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              activeId={activeId}
              onActiveChange={setActiveId}
            />
          </section>

          <section className="lg:col-span-1">
            <ComparisonRadar candidates={candidates} selectedIds={selectedIds} />
          </section>
        </div>
      </div>
    </div>
  );
}
