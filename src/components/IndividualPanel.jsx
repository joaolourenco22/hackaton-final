import React from 'react';
import Radar from './Radar';

export default function IndividualPanel({ candidate }) {
  if (!candidate) {
    return <div className="text-sm text-gray-600">Selecione um candidato no ranking.</div>;
  }

  const axes = ['Comunicação', 'Trabalho em Equipe', 'Resolução de Problemas', 'Adaptabilidade', 'Liderança', 'Criatividade'];
  const values = [
    candidate.soft_skills?.communication ?? 0,
    candidate.soft_skills?.teamwork ?? 0,
    candidate.soft_skills?.problem_solving ?? 0,
    candidate.soft_skills?.adaptability ?? 0,
    candidate.soft_skills?.leadership ?? 0,
    candidate.soft_skills?.creativity ?? 0,
  ];

  return (
    <div className="grid grid-cols-1 gap-6 items-center">
      <p className="text-sm font-medium text-gray-700 text-center">{candidate.name}</p>
      <div className="md:col-span-2">
        <Radar title={`Soft Skills de ${candidate.name}`} axes={axes} datasets={[{ label: candidate.name, color: '#7c3aed', values }]} maxValue={100} />
      </div>

    </div>
  );
}
