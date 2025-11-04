import { useEffect, useState } from 'react';
import { fetchCandidates, seed } from '@/services/api';
import CandidateCard from '@/components/CandidateCard';

export default function Candidatos() {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    location: '',
    min_hard: '',
    min_soft: '',
  });
  const [weightHard, setWeightHard] = useState(0.6);
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const params = { ...filters, weight_hard: weightHard, sort_by: 'total', order: 'desc', limit: 1000 };
      const list = await fetchCandidates(params);
      setCandidates(list);
      if (list.length && !activeId) setActiveId(list[0]._id);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightHard]);

  return (
    <div className="bg-[#f5f5f8] min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Ranking de Candidatos</h1>
          <div className="text-sm text-gray-800">Ordenado por Maior Score</div>
        </header>

        <section>
          {candidates.map((c, i) => (
            <CandidateCard key={c._id} candidate={c} index={i} />
          ))}
        </section>
      </div>
    </div>
  );
}
