import React from 'react';

export default function SimpleBarChart({ title, data = [], emptyMessage = "No data available" }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h4 className="chart-title">{title}</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  // Find max count to scale percentage
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="chart-container">
      <h4 className="chart-title">{title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((item, idx) => {
          const percent = Math.round((item.count / maxCount) * 100);
          return (
            <div key={idx} className="bar-row">
              <span className="bar-label" title={item.name}>
                {item.name}
              </span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.max(percent, 4)}%` }}
                />
              </div>
              <span className="bar-value">{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
