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
      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-violet-500"
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
  loading,
  onApply,
  roles = [],
  locations = [],
  stacks = [],
}) {
  const disableRegion = filters?.home_office === 'yes' || filters?.modalidade === 'remote';

  return (
    <section className="ui-panel p-5">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="stacks">Stacks/Linguagens (multi)</Label>
          <select
            id="stacks"
            multiple
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-violet-500 h-32"
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

        {/* Peso Hard removido por solicitação */}

        <div>
          <Label htmlFor="min_soft">Soft mínimo (1–5)</Label>
          <div className="flex items-center gap-3">
            <Slider
              id="min_soft"
              min={0}
              max={5}
              step={0.5}
              value={Number(filters.min_soft || 0)}
              onChange={(e) => onFiltersChange({ ...filters, min_soft: e.target.value })}
            />
            <span className="text-sm w-10 text-right">
              {Number(filters.min_soft || 0) > 0 ? Number(filters.min_soft).toFixed(1) : '-'}
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="sort_by">Ordenar por</Label>
          <Select
            id="sort_by"
            value={filters.sort_by || 'total'}
            onChange={(e) => onFiltersChange({ ...filters, sort_by: e.target.value })}
          >
            <option value="total">Score Total</option>
            <option value="soft">Soft skills</option>
            <option value="hard">Hard (GitHub)</option>
          </Select>
        </div>
      </div>

      {disableRegion && (
        <div className="mt-2 text-xs text-gray-600">Região desabilitada quando Home office = Sim ou Modalidade = Remoto.</div>
      )}

      <div className="pt-3 flex gap-2">
        <button className="ui-button-primary" onClick={() => onApply && onApply()} disabled={loading}>
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

      {/* Active filters summary */}
      {(
        (filters.role && filters.role !== '') ||
        (filters.location && filters.location !== '' && !disableRegion) ||
        (Array.isArray(filters.stacks) && filters.stacks.length > 0) ||
        (filters.home_office && filters.home_office !== '') ||
        (filters.modalidade && filters.modalidade !== '') ||
        (filters.carga && filters.carga !== '') ||
        (filters.experience && filters.experience !== '') ||
        (filters.relocate && filters.relocate !== '') ||
        (Number(filters.min_soft || 0) > 0) ||
        ((filters.sort_by || 'total') !== 'total')
      ) && (
        <div className="mt-4 border-t pt-3">
          <div className="text-sm text-gray-800 mb-2">Filtros ativos</div>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Stacks */}
            {Array.isArray(filters.stacks) && filters.stacks.map((s) => (
              <span key={`stack-${s}`} className="ui-chip inline-flex items-center">
                {s}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label={`Remover stack ${s}`}
                  onClick={() => onFiltersChange({ ...filters, stacks: (filters.stacks || []).filter((x) => x !== s) })}
                >
                  ×
                </button>
              </span>
            ))}

            {/* Role */}
            {filters.role && (
              <span className="ui-chip inline-flex items-center">
                {`Role: ${filters.role}`}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Remover role"
                  onClick={() => onFiltersChange({ ...filters, role: '' })}
                >
                  ×
                </button>
              </span>
            )}

            {/* Location (hidden if disabled by other options) */}
            {filters.location && !disableRegion && (
              <span className="ui-chip inline-flex items-center">
                {`Localização: ${filters.location}`}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Remover localização"
                  onClick={() => onFiltersChange({ ...filters, location: '' })}
                >
                  ×
                </button>
              </span>
            )}

            {/* Home office */}
            {filters.home_office && (
              <span className="ui-chip inline-flex items-center">
                {`Home office: ${filters.home_office === 'yes' ? 'Sim' : 'Não'}`}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Remover home office"
                  onClick={() => onFiltersChange({ ...filters, home_office: '' })}
                >
                  ×
                </button>
              </span>
            )}

            {/* Modalidade */}
            {filters.modalidade && (
              <span className="ui-chip inline-flex items-center">
                {`Modalidade: ${filters.modalidade === 'remote' ? 'Remoto' : filters.modalidade === 'hybrid' ? 'Híbrido' : 'Presencial'}`}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Remover modalidade"
                  onClick={() => onFiltersChange({ ...filters, modalidade: '' })}
                >
                  ×
                </button>
              </span>
            )}

            {/* Carga */}
            {filters.carga && (
              <span className="ui-chip inline-flex items-center">
                {`Carga: ${filters.carga === 'full_time' ? 'Full-time' : 'Part-time'}`}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Remover carga"
                  onClick={() => onFiltersChange({ ...filters, carga: '' })}
                >
                  ×
                </button>
              </span>
            )}

            {/* Experiência */}
            {filters.experience && (
              <span className="ui-chip inline-flex items-center">
                {`Experiência: ${filters.experience}${filters.experience.includes('+') ? '' : ' anos'}`}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Remover experiência"
                  onClick={() => onFiltersChange({ ...filters, experience: '' })}
                >
                  ×
                </button>
              </span>
            )}

            {/* Relocate */}
            {filters.relocate && (
              <span className="ui-chip inline-flex items-center">
                {`Realocação: ${filters.relocate === 'yes' ? 'Sim' : 'Não'}`}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Remover realocação"
                  onClick={() => onFiltersChange({ ...filters, relocate: '' })}
                >
                  ×
                </button>
              </span>
            )}

            {/* Soft mínimo */}
            {Number(filters.min_soft || 0) > 0 && (
              <span className="ui-chip inline-flex items-center">
                {`Soft ≥ ${Number(filters.min_soft).toFixed(1)}`}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Remover soft mínimo"
                  onClick={() => onFiltersChange({ ...filters, min_soft: 0 })}
                >
                  ×
                </button>
              </span>
            )}

            {/* Ordenação */}
            {(filters.sort_by || 'total') !== 'total' && (
              <span className="ui-chip inline-flex items-center">
                {`Ordenado: ${filters.sort_by === 'soft' ? 'Soft skills' : 'Hard (GitHub)'}`}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label="Remover ordenação"
                  onClick={() => onFiltersChange({ ...filters, sort_by: 'total' })}
                >
                  ×
                </button>
              </span>
            )}

            {/* Clear all shortcut */}
            <button
              type="button"
              className="text-sm text-violet-700 hover:text-violet-900 ml-1"
              onClick={() => onFiltersChange({
                search: '',
                role: '',
                location: '',
                min_hard: '',
                min_soft: 0,
                home_office: '',
                experience: '',
                modalidade: '',
                carga: '',
                relocate: '',
                stacks: [],
                sort_by: 'total',
              })}
              disabled={loading}
            >
              Limpar todos
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

