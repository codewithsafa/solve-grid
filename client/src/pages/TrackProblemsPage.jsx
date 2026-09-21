import React, { useState, useEffect } from 'react';
import { Activity, MapPin, Calendar, CheckCircle2, ChevronRight, Filter, AlertCircle } from 'lucide-react';
import StatusTimeline, { STATUS_STEPS } from '../components/StatusTimeline';
import { getProblems } from '../services/api';

export default function TrackProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchTrackList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProblems();
      setProblems(data);
      if (data.length > 0 && !selectedProblem) {
        setSelectedProblem(data[0]);
      } else if (selectedProblem) {
        const refreshed = data.find(p => p.id === selectedProblem.id);
        if (refreshed) setSelectedProblem(refreshed);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackList();
  }, []);

  const handleStatusChange = (updated) => {
    setSelectedProblem(updated);
    setProblems(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const filteredProblems = statusFilter === 'All'
    ? problems
    : problems.filter(p => p.status === statusFilter);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Civic Problem Tracking</h1>
        <p className="page-description">
          Monitor the lifecycle of reported problems from initial citizen submission to ground resolution.
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter by status */}
      <div className="card" style={{ padding: '12px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status Filter:</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('All')}
          >
            All ({problems.length})
          </button>
          {STATUS_STEPS.map(s => {
            const count = problems.filter(p => p.status === s.key).length;
            return (
              <button
                key={s.key}
                type="button"
                className={`btn btn-sm ${statusFilter === s.key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(s.key)}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(340px, 1.2fr)', gap: '20px' }}>
        {/* Left column: Problem list */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>
            Submitted Problems ({filteredProblems.length})
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Loading problem tracking logs...
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
              No problems found with status '{statusFilter}'.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredProblems.map(p => {
                const isSelected = selectedProblem && selectedProblem.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProblem(p)}
                    style={{
                      backgroundColor: isSelected ? 'var(--civic-accent-light)' : '#ffffff',
                      border: isSelected ? '1px solid var(--civic-accent)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge-category">{p.category}</span>
                      <span className={`badge badge-${p.status}`}>
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3 }}>
                      {p.title}
                    </h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        {p.district}, {p.state}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {formatDate(p.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Selected Problem Status Timeline & Detail */}
        <div>
          {selectedProblem ? (
            <div className="card" style={{ position: 'sticky', top: '20px' }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge-category">{selectedProblem.category}</span>
                  <span className={`badge badge-${selectedProblem.status}`}>
                    {selectedProblem.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {selectedProblem.title}
                </h2>
                <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>📍 {selectedProblem.district}, {selectedProblem.state}</span>
                  <span>🗓️ Submitted on {formatDate(selectedProblem.createdAt)}</span>
                </div>
              </div>

              {/* Status Timeline with Demo Control */}
              <StatusTimeline
                problem={selectedProblem}
                onStatusChange={handleStatusChange}
                showDemoControl={true}
              />

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Original Citizen Report
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {selectedProblem.description}
                </p>
              </div>

              {selectedProblem.problemInfos && selectedProblem.problemInfos.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Documented Context ({selectedProblem.problemInfos.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedProblem.problemInfos.map((info, idx) => (
                      <div key={idx} style={{ fontSize: '12px', color: 'var(--text-secondary)', backgroundColor: '#f8fafc', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                        • {info.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              Select a problem from the left to view its tracking timeline and simulation controls.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
