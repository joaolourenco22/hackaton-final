import React from 'react';

function deg2rad(d) {
  return (d * Math.PI) / 180;
}

function polarPoint(cx, cy, r, angleDeg) {
  const a = deg2rad(angleDeg - 90);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export default function Radar({
  width = 300,
  height = 300,
  axes = [],
  datasets = [],
  maxValue = 100,
  title = '',
}) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 24;
  const angleStep = 360 / Math.max(axes.length, 1);

  const gridLevels = 4;
  const grid = Array.from({ length: gridLevels }, (_, i) => ((i + 1) / gridLevels) * radius);

  function polygonPoints(values) {
    return values
      .map((v, i) => {
        const r = (Math.max(0, Math.min(v, maxValue)) / maxValue) * radius;
        const [x, y] = polarPoint(cx, cy, r, i * angleStep);
        return `${x},${y}`;
      })
      .join(' ');
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={title}
        className="w-full h-auto max-w-[400px] mx-auto block"
      >
        <title>{title}</title>

        {/* Grid circular */}
        {grid.map((r, idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--panel-border)"
          />
        ))}

        {/* Eixos e rótulos */}
        {axes.map((label, i) => {
          const [x, y] = polarPoint(cx, cy, radius, i * angleStep);
          const [tx, ty] = polarPoint(cx, cy, radius + 12, i * angleStep);
          return (
            <g key={label}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--panel-border)" />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs"
                style={{ fill: 'var(--foreground)' }}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Polígonos dos datasets */}
        {datasets.map((d, idx) => (
          <g key={idx}>
            <polygon
              points={polygonPoints(d.values)}
              fill={d.color + '22'}
              stroke={d.color}
              strokeWidth={3}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
