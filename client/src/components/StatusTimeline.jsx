import React, { useState } from 'react';
import { Check, Clock, PlayCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { updateProblemStatus } from '../services/api';

export const STATUS_STEPS = [
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'CATEGORISED', label: 'Categorised' },
  { key: 'UNDER_VALIDATION', label: 'Under Validation' },
  { key: 'VALIDATED', label: 'Validated' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' }
];

export default function StatusTimeline({ problem, onStatusChange, showDemoControl = true }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const currentIndex = STATUS_STEPS.findIndex(s => s.key === problem.status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  const handleStatusSelect = async (newStatus) => {
    try {
      setUpdating(true);
      setError(null);
      const updated = await updateProblemStatus(problem.id, newStatus);
      if (onStatusChange) {
        onStatusChange(updated);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ margin: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Civic Resolution Timeline
        </span>
        <span className={`badge badge-${problem.status}`}>
          {STATUS_STEPS.find(s => s.key === problem.status)?.label || problem.status}
        </span>
      </div>

      {/* Visual Timeline Steps */}
      <div className="status-timeline">
        <div className="timeline-track" />
        {STATUS_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          return (
            <div
              key={step.key}
              className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="timeline-step-icon">
                {isCompleted ? <Check size={14} strokeWidth={3} /> : idx + 1}
              </div>
              <span className="timeline-step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Demo Developer Control */}
      {showDemoControl && (
        <div
          style={{
            marginTop: '14px',
            padding: '10px 14px',
            backgroundColor: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🛠️ Demo Control:
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Simulate authority progress
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              className="form-select"
              style={{ padding: '4px 8px', fontSize: '12px' }}
              value={problem.status}
              disabled={updating}
              onChange={(e) => handleStatusSelect(e.target.value)}
            >
              {STATUS_STEPS.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
            {updating && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Updating...</span>}
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: '#b91c1c', fontSize: '12px', marginTop: '6px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
