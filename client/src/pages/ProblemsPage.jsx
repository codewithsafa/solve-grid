import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import ProblemCard from '../components/ProblemCard';
import ProblemReelModal from '../components/ProblemReelModal';
import ProblemDetailModal from '../components/ProblemDetailModal';
import { getProblems, getProblemById } from '../services/api';

const CATEGORIES = [
  'All',
  'Civic Infrastructure',
  'Sanitation',
  'Transport',
  'Public Safety',
  'Healthcare',
  'Environment',
  'Education',
  'Other'
];

export default function ProblemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Reel Modal State (Opens on card click)
  const [reelProblem, setReelProblem] = useState(null);

  // 2. Full Problem Detail Modal State (Opens when 'More Info' is clicked in reel or directly)
  const [detailProblem, setDetailProblem] = useState(null);
  const [detailInitialTab, setDetailInitialTab] = useState('view');

  const fetchProblemList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProblems({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined
      });
      setProblems(data);

      // Check if URL specifies a problem ID to open
      const urlId = searchParams.get('id');
      if (urlId) {
        const target = data.find(p => p.id === urlId);
        if (target) {
          setReelProblem(target);
        } else {
          getProblemById(urlId).then(p => {
            if (p) setReelProblem(p);
          }).catch(() => {});
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemList();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProblemList();
  };

  // When card is clicked -> Open like Insta Reel
  const handleCardClick = (problem, actionType = 'view') => {
    setReelProblem(problem);
    setSearchParams({ id: problem.id });
  };

  // When "More Info" is clicked on the Reel -> Open Full Problem Card Detail Modal
  const handleOpenMoreInfoFromReel = (problem) => {
    setDetailProblem(problem);
    setDetailInitialTab('view');
  };

  const handleCloseReel = () => {
    setReelProblem(null);
    setSearchParams({});
  };

  const handleCloseDetail = () => {
    setDetailProblem(null);
  };

  // Up/Down navigation between reels
  const handleNavigateReel = (direction) => {
    if (!reelProblem || problems.length === 0) return;
    const idx = problems.findIndex(p => p.id === reelProblem.id);
    if (idx === -1) return;
    const nextIdx = idx + direction;
    if (nextIdx >= 0 && nextIdx < problems.length) {
      const nextProb = problems[nextIdx];
      setReelProblem(nextProb);
      setSearchParams({ id: nextProb.id });
    }
  };

  const handleProblemUpdated = (updated) => {
    setProblems(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    if (reelProblem && reelProblem.id === updated.id) {
      setReelProblem(updated);
    }
    if (detailProblem && detailProblem.id === updated.id) {
      setDetailProblem(updated);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Citizen Problems Discovery</h1>
        <p className="page-description">
          Browse verified real-world civic issues reported by citizens. Click any problem to view in Reel mode.
        </p>
      </div>

      {/* Discovery Filters & Search Bar */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1 1 300px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '34px' }}
              placeholder="Search by keywords, area, or #hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Category:</span>
          </div>
          <select
            className="form-select"
            style={{ padding: '6px 10px', fontSize: '13px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchProblemList}
            title="Refresh feed"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="spin-animate" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '14px' }}>Loading reported civic problems...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            No problems found
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Try selecting another category or clear your search term.
          </p>
        </div>
      ) : (
        /* Problem Cards Grid */
        <div className="problem-grid">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onClick={handleCardClick}
              onUpvote={handleProblemUpdated}
            />
          ))}
        </div>
      )}

      {/* 1. INSTA REEL STYLE PROBLEM VIEWER */}
      {reelProblem && (
        <ProblemReelModal
          problem={reelProblem}
          problemsList={problems}
          isMoreInfoOpen={Boolean(detailProblem)}
          onClose={handleCloseReel}
          onOpenMoreInfo={handleOpenMoreInfoFromReel}
          onProblemUpdated={handleProblemUpdated}
          onNavigate={handleNavigateReel}
        />
      )}

      {/* 2. FULL PROBLEM DETAIL MODAL (Opened when 'More Info' is clicked) */}
      {detailProblem && (
        <ProblemDetailModal
          problem={detailProblem}
          initialTab={detailInitialTab}
          onClose={handleCloseDetail}
          onUpdate={handleProblemUpdated}
        />
      )}
    </div>
  );
}
