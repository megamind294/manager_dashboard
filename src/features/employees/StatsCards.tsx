import React from 'react';

interface StatsCardsProps {
  total: number;
  active: number;
  onLeave: number;
  departments: number;
}

export default function StatsCards({ total, active, onLeave, departments }: StatsCardsProps) {
  const cards = [
    ['Total employees', total],
    ['Active', active],
    ['On leave', onLeave],
    ['Departments', departments],
  ];

  return (
    <section className="stats-grid" aria-label="Employee statistics">
      {cards.map(([label, value]) => (
        <article className="stat-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </section>
  );
}
