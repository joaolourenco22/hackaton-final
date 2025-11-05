import { useEffect, useState } from "react";
import Filters from "@/components/Filters";
import KPIs from "@/components/KPIs";
import { fetchCandidates, fetchKPIs } from "@/services/api";

function deriveStacks(c) {
  const tags = Array.isArray(c?.tags) ? c.tags.map((x) => String(x).toLowerCase()) : [];
  const role = String(c?.role || '').toLowerCase();
  const addIf = (cond, label, set) => { if (cond) set.add(label); };
  const has = (keys) => keys.some((k) => tags.some((t) => t.includes(k)));
  const s = new Set();
  // Languages
  addIf(has(['javascript','js','node','react','vue','next']) || role.includes('front') || role.includes('back'), 'JavaScript', s);
  addIf(has(['typescript','ts']) || role.includes('front') || role.includes('full'), 'TypeScript', s);
  addIf(has(['python']) || role.includes('data') || role.includes('ml') || role.includes('ai'), 'Python', s);
  addIf(tags.includes('java') || has([' spring','spring ']), 'Java', s);
  addIf(has(['c#','csharp','.net','dotnet']), 'C#', s);
  addIf(has(['c++','cpp']), 'C++', s);
  addIf(tags.includes('php') || has(['laravel']), 'PHP', s);
  addIf(tags.includes('go') || tags.includes('golang'), 'Go', s);
  addIf(tags.includes('ruby') || has(['rails']), 'Ruby', s);
  addIf(tags.includes('rust'), 'Rust', s);
  addIf(tags.includes('kotlin') || role.includes('android'), 'Kotlin', s);
  addIf(tags.includes('swift') || role.includes('ios'), 'Swift', s);
  addIf(has(['sql','postgres','mysql']), 'SQL', s);
  addIf(tags.includes('html'), 'HTML', s);
  addIf(has(['css','sass','tailwind']), 'CSS', s);
  // Frameworks/areas
  addIf(has(['react']), 'React', s);
  addIf(has(['node']), 'Node', s);
  addIf(has(['vue']), 'Vue', s);
  addIf(has(['next']), 'Next.js', s);
  addIf(has(['angular']), 'Angular', s);
  addIf(has(['spring']), 'Spring', s);
  addIf(has(['.net','dotnet','c#']), '.NET', s);
  addIf(has(['django']), 'Django', s);
  addIf(has(['rails']), 'Rails', s);
  addIf(has(['laravel']), 'Laravel', s);
  // Cloud/infra
  addIf(has(['aws']), 'AWS', s);
  addIf(has(['azure']), 'Azure', s);
  addIf(has(['gcp','google cloud']), 'GCP', s);
  addIf(has(['docker']), 'Docker', s);
  addIf(has(['k8s','kubernetes']), 'Kubernetes', s);
  return Array.from(s);
}

export default function Fil() {
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    location: "",
    min_hard: "",
    min_soft: "",
    home_office: "",
    experience: "",
    modalidade: "",
    carga: "",
    relocate: "",
    stacks: [],
  });
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [weightHard, setWeightHard] = useState(0.6);
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchCandidates({ limit: 1000 });
        const uniq = (arr) => Array.from(new Set(arr.filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b)));
        setRoles(uniq(list.map((c) => c.role)));
        setLocations(uniq(list.map((c) => c.location)));
        const stacksSet = new Set();
        list.forEach((c) => deriveStacks(c).forEach((x) => stacksSet.add(x)));
        setStacks(Array.from(stacksSet).sort((a, b) => a.localeCompare(b)));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  async function onApply() {
    setLoading(true);
    try {
      // Build search tokens from stacks and preferences
      const tokens = [];
      if (Array.isArray(filters.stacks) && filters.stacks.length) tokens.push(...filters.stacks);
      if (filters.modalidade) tokens.push(filters.modalidade);
      if (filters.carga) tokens.push(filters.carga);
      if (filters.relocate === 'yes') tokens.push('relocate');

      const params = {
        role: filters.role || undefined,
        search: tokens.length ? tokens.join(' ') : undefined,
        location: (filters.home_office === 'yes' || filters.modalidade === 'remote') ? undefined : (filters.location || undefined),
        weight_hard: weightHard,
      };
      // Opcional: mapear experiência para um mínimo de anos
      if (filters.experience) {
        const map = { '0-1': 0, '2-3': 2, '4-6': 4, '7+': 7 };
        const minYears = map[filters.experience];
        if (typeof minYears === 'number') params.min_years = String(minYears);
      }
      const data = await fetchKPIs(params);
      setKpis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-xl font-semibold px-4 pt-4">Filtrar Candidatos</h1>
      <div className="p-4 space-y-4">
        <Filters
          filters={filters}
          onFiltersChange={setFilters}
          weightHard={weightHard}
          onWeightHardChange={setWeightHard}
          loading={loading}
          onApply={onApply}
          roles={roles}
          locations={locations}
          stacks={stacks}
        />
        <KPIs kpis={kpis} />
      </div>
    </>
  );
}

