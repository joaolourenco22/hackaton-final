import React from 'react';

export default function CandidateCard({ candidate, index = 0, onClick }) {
  const accentColors = [
    'var(--primary)',
    'var(--primary-2)',
    'var(--nu-verde-sucesso)'
  ];
  const accent = accentColors[index % accentColors.length] || 'var(--nu-cinza-escuro)';

  const to10 = (v) => (v != null ? (Number(v) / 10).toFixed(1) : '-');
  const total10 = to10(candidate.total_score);
  const hard10 = to10(candidate.hard_score);
  const totalPct = Number.isFinite(Number(candidate?.total_score))
    ? Math.max(0, Math.min(100, Math.round(Number(candidate.total_score))))
    : 0;

  const deriveLanguages = (tags = [], role = '') => {
    const t = Array.isArray(tags) ? tags.map((x) => String(x).toLowerCase()) : [];
    const r = String(role || '').toLowerCase();
    const langSet = new Set();
    const pushIf = (cond, name) => { if (cond) langSet.add(name); };

    pushIf(t.some(x => ['javascript', 'js', 'node', 'react', 'vue', 'next'].some(k => x.includes(k))), 'JavaScript');
    pushIf(t.some(x => ['typescript', 'ts'].some(k => x.includes(k))), 'TypeScript');
    pushIf(t.some(x => x.includes('python')), 'Python');
    pushIf(t.some(x => x === 'java' || x.includes(' spring') || x.includes('spring ')), 'Java');
    pushIf(t.some(x => x.includes('c#') || x.includes('csharp') || x.includes('.net') || x.includes('dotnet')), 'C#');
    pushIf(t.some(x => x.includes('c++') || x.includes('cpp')), 'C++');
    pushIf(t.some(x => x === 'php' || x.includes('laravel')), 'PHP');
    pushIf(t.some(x => x === 'go' || x === 'golang'), 'Go');
    pushIf(t.some(x => x === 'ruby' || x.includes('rails')), 'Ruby');
    pushIf(t.some(x => x === 'rust'), 'Rust');
    pushIf(t.some(x => x === 'kotlin' || x.includes('android')), 'Kotlin');
    pushIf(t.some(x => x === 'swift' || x.includes('ios')), 'Swift');
    pushIf(t.some(x => x.includes('sql') || x.includes('postgres') || x.includes('mysql')), 'SQL');
    pushIf(t.some(x => x.includes('html')), 'HTML');
    pushIf(t.some(x => x.includes('css') || x.includes('sass') || x.includes('tailwind')), 'CSS');

    // Role inference fallback
    pushIf(r.includes('front'), 'JavaScript');
    pushIf(r.includes('front'), 'TypeScript');
    pushIf(r.includes('full'), 'TypeScript');
    pushIf(r.includes('back'), 'JavaScript');
    pushIf(r.includes('back'), 'Java');
    pushIf(r.includes('data') || r.includes('ml') || r.includes('ia') || r.includes('ai'), 'Python');
    pushIf(r.includes('mobile') || r.includes('android'), 'Kotlin');
    pushIf(r.includes('mobile') || r.includes('ios'), 'Swift');
    pushIf(r.includes('devops') || r.includes('sre') || r.includes('cloud'), 'Go');
    pushIf(r.includes('qa') || r.includes('test'), 'JavaScript');

    return Array.from(langSet);
  };
  const languages = deriveLanguages(candidate.tags || [], candidate.role || '');

  const ghUrl = candidate.github || candidate.github_url || candidate?.social?.github || '';
  const liUrl = candidate.linkedin || candidate.linkedin_url || candidate?.social?.linkedin || '';
  const ghLink = ghUrl || `https://github.com/search?q=${encodeURIComponent(candidate.name || '')}`;
  const liLink = liUrl || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(candidate.name || '')}`;

  const initials = (name) => {
    const parts = String(name || '').trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  };

  const modeRaw = String(candidate.work_mode || candidate.preference || '').toLowerCase();
  let workModeLabel = '';
  if (modeRaw === 'remote' || modeRaw === 'remoto' || modeRaw === 'part_time') workModeLabel = 'Remoto';
  else if (modeRaw === 'hybrid' || modeRaw === 'hibrido' || modeRaw === 'híbrido') workModeLabel = 'Híbrido';
  else if (modeRaw === 'onsite' || modeRaw === 'presencial' || modeRaw === 'full_time') workModeLabel = 'Presencial';

  return (
    <article
      className="ui-panel relative overflow-hidden p-5 transition duration-200 hover:shadow-md hover:-translate-y-0.5 hover:ring-1 hover:ring-violet-100"
      aria-label={`Candidato ${candidate.name}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Accent shape */}
      <div className="absolute -top-12 -left-8 w-28 h-28 bg-[var(--primary-2)] rounded-br-[64px] opacity-90" aria-hidden />

      {/* Side social icons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2" aria-label="Redes sociais">
        <a href={ghLink} target="_blank" rel="noopener noreferrer" title={ghUrl ? 'Abrir GitHub' : 'Pesquisar no GitHub'} className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${ghUrl ? 'text-[var(--foreground)]' : 'text-[color:var(--text-muted)]'}`} style={{ background: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.486 2 12.02c0 4.427 2.865 8.185 6.839 9.504.5.092.683-.218.683-.486 0-.24-.009-.876-.014-1.72-2.782.605-3.37-1.343-3.37-1.343-.454-1.155-1.11-1.463-1.11-1.463-.907-.62.069-.608.069-.608 1.003.071 1.53 1.03 1.53 1.03.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.221-.253-4.556-1.114-4.556-4.956 0-1.094.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.503.337 1.91-1.296 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.594 1.028 2.688 0 3.852-2.339 4.699-4.566 4.947.36.31.68.92.68 1.855 0 1.338-.012 2.417-.012 2.747 0 .27.18.582.688.483A10.03 10.03 0 0 0 22 12.02C22 6.486 17.523 2 12 2Z" clipRule="evenodd" /></svg>
        </a>
        <a href={liLink} target="_blank" rel="noopener noreferrer" title={liUrl ? 'Abrir LinkedIn' : 'Pesquisar no LinkedIn'} className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${liUrl ? 'text-[var(--foreground)]' : 'text-[color:var(--text-muted)]'}`} style={{ background: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5ZM.3 8.2h4.4V23H.3V8.2Zm7.7 0h4.2v2.015h.06c.586-1.11 2.017-2.285 4.154-2.285C20.7 7.93 23 9.987 23 14.18V23h-4.4v-7.75c0-1.848-.034-4.224-2.575-4.224-2.58 0-2.974 2.01-2.974 4.088V23H8V8.2Z"/></svg>
        </a>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center text-center pt-5 pb-5">
        <div className="text-lg font-semibold text-[var(--foreground)]">{candidate.name}</div>
        <div className="text-sm text-[color:var(--text-muted)]">{candidate.role}</div>
      </div>

      {/* Score progress */}
      <div className="mt-3 ui-progress" aria-label="Progresso do score total">
        <span style={{ width: `${totalPct}%` }} />
      </div>

      {/* KPI chips */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <span className="ui-chip" style={{ '--primary': 'var(--nu-verde-sucesso)' }}>
          Score {total10} / 10
        </span>
        <span className="ui-chip">GitHub {hard10} / 10</span>
        {Number.isFinite(candidate.years_experience) && (
          <span className="ui-chip">{candidate.years_experience} anos exp.</span>
        )}
        {workModeLabel && <span className="ui-chip">{workModeLabel}</span>}
      </div>

      {/* Location */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-[color:var(--text-muted)]">
        <span className="inline-flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/></svg>
          {candidate.location}
        </span>
      </div>

      {/* Languages */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-[color:var(--text-muted)]">Linguagens:</span>
        {languages.length === 0 ? (
          <span className="ui-chip text-xs">Sem informação</span>
        ) : (
          <>
            {languages.slice(0, 4).map((lang) => (
              <span key={lang} className="ui-chip text-xs">{lang}</span>
            ))}
            {languages.length > 4 && (
              <span className="ui-chip text-xs" aria-label={`Mais ${languages.length - 4} linguagens`}>+{languages.length - 4}</span>
            )}
          </>
        )}
      </div>

    </article>
  );
}
