import React from 'react';

function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="text-sm text-gray-800">
      {children}
    </label>
  );
}

function Select({ id, children, ...props }) {
  return (
    <select
      id={id}
      className="w-full border border-gray-300 rounded px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-violet-500"
      {...props}
    >
      {children}
    </select>
  );
}

function Slider({ id, min = 0, max = 1, step = 0.05, ...props }) {
  return <input id={id} type="range" min={min} max={max} step={step} className="w-full accent-violet-600" {...props} />;
}

export default function Filters({
  filters,
  onFiltersChange,
  weightHard,
  onWeightHardChange,
  loading,
  onApply,
  roles = [],
  locations = [],
  stacks = [],
}) {
  const disableRegion = filters?.home_office === 'yes' || filters?.modalidade === 'remote';

  return (
    <section className="ui-panel p-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="md:col-span-2">
          <Label htmlFor="stacks">Stacks/Linguagens (multi)</Label>
          <select
            id="stacks"
            multiple
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-violet-500 h-32"
            value={filters.stacks || []}
            onChange={(e) => {
              const vals = Array.from(e.target.selectedOptions).map((o) => o.value);
              onFiltersChange({ ...filters, stacks: vals });
            }}
          >
            {stacks.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            id="role"
            value={filters.role}
            onChange={(e) => onFiltersChange({ ...filters, role: e.target.value })}
          >
            <option value="">Todos</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Localização</Label>
          <Select
            id="location"
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            disabled={disableRegion}
          >
            <option value="">Todas</option>
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="home_office">Home office</Label>
          <Select
            id="home_office"
            value={filters.home_office || ''}
            onChange={(e) => onFiltersChange({ ...filters, home_office: e.target.value })}
          >
            <option value="">Qualquer</option>
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="modalidade">Modalidade</Label>
          <Select
            id="modalidade"
            value={filters.modalidade || ''}
            onChange={(e) => onFiltersChange({ ...filters, modalidade: e.target.value })}
          >
            <option value="">Qualquer</option>
            <option value="remote">Remoto</option>
            <option value="hybrid">Híbrido</option>
            <option value="onsite">Presencial</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="carga">Carga</Label>
          <Select
            id="carga"
            value={filters.carga || ''}
            onChange={(e) => onFiltersChange({ ...filters, carga: e.target.value })}
          >
            <option value="">Qualquer</option>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="experience">Experiência</Label>
          <Select
            id="experience"
            value={filters.experience || ''}
            onChange={(e) => onFiltersChange({ ...filters, experience: e.target.value })}
          >
            <option value="">Qualquer</option>
            <option value="0-1">0-1 anos</option>
            <option value="2-3">2-3 anos</option>
            <option value="4-6">4-6 anos</option>
            <option value="7+">7+ anos</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="relocate">Disponível para realocação</Label>
          <Select
            id="relocate"
            value={filters.relocate || ''}
            onChange={(e) => onFiltersChange({ ...filters, relocate: e.target.value })}
          >
            <option value="">Qualquer</option>
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="weight">Peso Hard</Label>
          <div className="flex items-center gap-3">
            <Slider id="weight" min={0} max={1} step={0.05} value={weightHard} onChange={(e) => onWeightHardChange(parseFloat(e.target.value))} />
            <span className="text-sm w-10 text-right">{weightHard.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {disableRegion && (
        <div className="mt-2 text-xs text-gray-600">Região desabilitada quando Home office = Sim ou Modalidade = Remoto.</div>
      )}

      <div className="pt-3 flex gap-2">
        <button className="ui-button-primary" onClick={onApply} disabled={loading}>
          {loading ? 'Carregando...' : 'Aplicar Filtros'}
        </button>
        <button
          type="button"
          className="ui-button-secondary"
          onClick={() => onFiltersChange({
            search: '',
            role: '',
            location: '',
            min_hard: '',
            min_soft: '',
            home_office: '',
            experience: '',
            modalidade: '',
            carga: '',
            relocate: '',
            stacks: [],
          })}
          disabled={loading}
        >
          Limpar
        </button>
      </div>
    </section>
  );
}

