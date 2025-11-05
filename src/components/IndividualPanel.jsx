import React from 'react';
import Radar from './Radar';

export default function IndividualPanel({ candidate }) {
  const axes = [
    'Comunicação',
    'Trabalho em Equipe',
    'Resolução de Problemas',
    'Adaptabilidade',
    'Liderança',
    'Criatividade',
  ];

  const values = candidate
    ? [
        candidate.soft_skills?.communication ?? 0,
        candidate.soft_skills?.teamwork ?? 0,
        candidate.soft_skills?.problem_solving ?? 0,
        candidate.soft_skills?.adaptability ?? 0,
        candidate.soft_skills?.leadership ?? 0,
        candidate.soft_skills?.creativity ?? 0,
      ]
    : [];

  const datasets = candidate
    ? [{ label: candidate.name, color: '#7c3aed', values }]
    : [];

  return (
    <div className="grid grid-cols-1 gap-3 items-center">
      {candidate && (
        <p className="text-sm font-bold text-gray-800 text-center">{candidate.name}</p>
      )}
      <div className="md:col-span-2">
        <Radar
          title={candidate ? `Soft Skills de ${candidate.name}` : 'Soft Skills'}
          axes={axes}
          datasets={datasets}
          maxValue={100}
        />
      </div>
      {!candidate && (
        <p className="text-xs text-gray-600 text-center">Selecione um candidato para visualizar o radar.</p>
      )}
    </div>
  );
}
