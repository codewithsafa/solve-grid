import React, { useState, useEffect } from 'react';
import { BarChart2, Layers, Map, Navigation, RefreshCw, AlertCircle } from 'lucide-react';
import SimpleBarChart from '../components/SimpleBarChart';
import { getDashboardStats } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Civic Problem Intelligence Dashboard</h1>
          <p className="page-description">
            Aggregated real-time metrics demonstrating structured civic problem analytics from citizen reports.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchStats}
          title="Refresh statistics"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="spin-animate" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '14px' }}>Compiling civic metrics from database...</p>
        </div>
      ) : stats ? (
        <>
          {/* Top 4 Metric Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-card-title">Total Problems</span>
              <span className="stat-card-value">{stats.totals.problems}</span>
              <span className="stat-card-sub">Citizen issues reported</span>
            </div>

            <div className="stat-card">
              <span className="stat-card-title">Categories</span>
              <span className="stat-card-value">{stats.totals.categories}</span>
              <span className="stat-card-sub">Civic problem sectors</span>
            </div>

            <div className="stat-card">
              <span className="stat-card-title">States</span>
              <span className="stat-card-value">{stats.totals.states}</span>
              <span className="stat-card-sub">Geographic coverage</span>
            </div>

            <div className="stat-card">
              <span className="stat-card-title">Districts</span>
              <span className="stat-card-value">{stats.totals.districts}</span>
              <span className="stat-card-sub">Municipalities mapped</span>
            </div>
          </div>

          {/* Aggregated Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* Problems by Category Bar Chart */}
            <SimpleBarChart
              title="Problems by Category"
              data={stats.byCategory}
              emptyMessage="No category records found"
            />

            {/* Problems by State Bar Chart */}
            <SimpleBarChart
              title="Problems by State"
              data={stats.byState}
              emptyMessage="No state records found"
            />
          </div>

          {/* Problems by District List / Chart */}
          <div style={{ marginTop: '4px' }}>
            <SimpleBarChart
              title="Problems by District & Municipal Area"
              data={stats.byDistrict}
              emptyMessage="No district records found"
            />
          </div>

          {/* Status Breakdown Summary */}
          {stats.byStatus && stats.byStatus.length > 0 && (
            <div className="chart-container" style={{ marginTop: '4px' }}>
              <h4 className="chart-title">Civic Resolution Pipeline Status</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {stats.byStatus.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <span className={`badge badge-${s.name}`}>{s.name.replace(/_/g, ' ')}</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
