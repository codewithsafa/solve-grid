import React, { useState } from 'react';
import { FileText, PlusCircle, Check } from 'lucide-react';
import { addProblemInfo } from '../services/api';

export default function AddInfoSection({ problemId, initialInfos = [], onInfoAdded }) {
  const [infos, setInfos] = useState(initialInfos);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const newInfo = await addProblemInfo(problemId, content);
      setInfos([newInfo, ...infos]);
      setContent('');
      setIsOpen(false);
      if (onInfoAdded) {
        onInfoAdded(newInfo);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="content-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div className="section-heading" style={{ margin: 0 }}>
          <FileText size={16} />
          <span>Community Context & Additional Information ({infos.length})</span>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <PlusCircle size={14} />
          <span>{isOpen ? 'Cancel' : 'Add Information'}</span>
        </button>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
        Help document this issue by adding timeline context, official reference numbers, or municipal contact details.
      </p>

      {/* Add Info Form (Collapsible / Toggleable) */}
      {isOpen && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <div className="card" style={{ padding: '16px', backgroundColor: '#fcfdfd', border: '1px solid #bfdbfe' }}>
            <label className="form-label" style={{ marginBottom: '6px' }}>
              Add verified context or background info:
            </label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '80px', marginBottom: '8px' }}
              placeholder="e.g. Road has been damaged for approximately 3 months, or BBMP complaint ticket was filed last week..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
            />
            {error && <p style={{ color: '#b91c1c', fontSize: '12px', marginBottom: '8px' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submitting || !content.trim()}
              >
                <Check size={14} />
                <span>{submitting ? 'Saving...' : 'Save Information'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* List of Community Added Infos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {infos.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No additional context added yet. Click 'Add Information' to enrich this report.
          </p>
        ) : (
          infos.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                backgroundColor: '#ffffff',
                borderLeft: '3px solid var(--civic-accent)',
                borderTop: '1px solid var(--border-subtle)',
                borderRight: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '10px 14px',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Verified Civic Context • Added {formatDate(item.createdAt)}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {item.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
