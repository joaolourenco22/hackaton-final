import React from 'react';

export default function CandidateCard({ candidate, index = 0 }) {
  const accentColors = [
    'var(--nu-roxo)',
    'var(--nu-roxo-claro)',
    'var(--nu-verde-sucesso)'
  ];
  const accent = accentColors[index] || 'var(--nu-cinza-escuro)';

  const to10 = (v) => (v != null ? (Number(v) / 10).toFixed(1) : '—');
  const total10 = to10(candidate.total_score);
  const hard10 = to10(candidate.hard_score);
  const ss = candidate.soft_skills || {};

  return (
    <article
      className="ui-panel p-4 mb-3"
      style={{ borderLeft: `6px solid ${accent}` }}
      aria-label={`Candidato ${candidate.name}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <a className="text-base font-semibold text-gray-900 hover:underline" href="#" aria-label={`Abrir ${candidate.name}`}>
            {candidate.name}
          </a>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-700">
            <span title="Role">{candidate.role}</span>
            <span aria-hidden>•</span>
            <span title="Localização">{candidate.location}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-700">PONTUAÇÃO</div>
          <div className="text-3xl font-bold" style={{ color: 'var(--nu-verde-sucesso)' }}>{total10}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <div className="font-medium text-gray-900 mb-1">Pontuação Técnica</div>
          <div className="text-sm text-gray-800">GitHub: {hard10} / 10</div>
        </div>
        <div>
          <div className="font-medium text-gray-900 mb-1">Soft Skills</div>
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-0.5">
            <li>Comunicação: {to10(ss.communication)} / 10</li>
            <li>Equipa: {to10(ss.teamwork)} / 10</li>
            <li>Resolução: {to10(ss.problem_solving)} / 10</li>
            <li>Adaptabilidade: {to10(ss.adaptability)} / 10</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-gray-700 mb-2">Assistente de IA</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button type="button" className="ui-button-primary">✨ Resumir Perfil</button>
          <button type="button" className="ui-button-primary">✨ Gerar Perguntas de Entrevista</button>
        </div>
      </div>
    </article>
  );
}

