import React, { useState, useEffect } from 'react';
import { X, MapPin, ArrowBigUp, MessageSquare, Info, Share2, Calendar, Check } from 'lucide-react';
import DiscussionSection from './DiscussionSection';
import AddInfoSection from './AddInfoSection';
import StatusTimeline from './StatusTimeline';
import { upvoteProblem } from '../services/api';

export default function ProblemDetailModal({ problem: initialProblem, initialTab = 'view', onClose, onUpdate }) {
  const [problem, setProblem] = useState(initialProblem);
  const [upvotes, setUpvotes] = useState(initialProblem.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setProblem(initialProblem);
    setUpvotes(initialProblem.upvotes || 0);
  }, [initialProblem]);

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    try {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      const updated = await upvoteProblem(problem.id);
      setProblem(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      console.error(err);
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  const handleShare = () => {
    const url = window.location.origin + `/problems?id=${problem.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusChange = (updated) => {
    setProblem(updated);
    if (onUpdate) onUpdate(updated);
  };

  const hashtagsArray = (problem.hashtags || '')
    .split(/[\s,]+/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0 && tag.startsWith('#'));

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-category">{problem.category}</span>
            <span className={`badge badge-${problem.status}`}>
              {problem.status.replace(/_/g, ' ')}
            </span>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            title="Close and continue reel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              backgroundColor: '#f1f5f9',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Back to Reel</span>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Optional Media (Video or Image) */}
          {(problem.videoUrl || problem.imageUrl) && (
            <div
              style={{
                width: '100%',
                maxHeight: '340px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#0f172a',
                marginBottom: '16px'
              }}
            >
              {problem.videoUrl ? (
                <video
                  src={problem.videoUrl}
                  controls
                  playsInline
                  style={{ width: '100%', maxHeight: '340px', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <img
                  src={problem.imageUrl}
                  alt={problem.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.target.parentElement.style.display = 'none';
                  }}
                />
              )}
            </div>
          )}

          {/* Title & Metadata */}
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {problem.title}
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} />
              <span>{problem.district}, {problem.state}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>Reported on {formatDate(problem.createdAt)}</span>
            </div>
          </div>

          {/* Full Description */}
          <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '18px', whiteSpace: 'pre-line' }}>
            {problem.description}
          </div>

          {/* Hashtags */}
          {hashtagsArray.length > 0 && (
            <div className="tag-list" style={{ marginBottom: '20px' }}>
              {hashtagsArray.map((tag, idx) => (
                <span key={idx} className="tag-item">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Focused Action Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px'
            }}
          >
            <button
              type="button"
              className={`btn btn-sm ${hasUpvoted ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleUpvote}
            >
              <ArrowBigUp size={16} fill={hasUpvoted ? "currentColor" : "none"} />
              <span>{hasUpvoted ? `Upvoted (${upvotes})` : `Upvote (${upvotes})`}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleShare}
            >
              {copied ? <Check size={14} style={{ color: '#16a34a' }} /> : <Share2 size={14} />}
              <span>{copied ? 'Link Copied' : '↗ Share'}</span>
            </button>
          </div>

          {/* Tracking Status Timeline */}
          <StatusTimeline problem={problem} onStatusChange={handleStatusChange} showDemoControl={true} />

          {/* Community Context / Add Info Section */}
          <AddInfoSection
            problemId={problem.id}
            initialInfos={problem.problemInfos || []}
            onInfoAdded={(newInfo) => {
              const updated = {
                ...problem,
                problemInfos: [newInfo, ...(problem.problemInfos || [])]
              };
              setProblem(updated);
              if (onUpdate) onUpdate(updated);
            }}
          />

          {/* Discussion Section */}
          <DiscussionSection
            problemId={problem.id}
            initialDiscussions={problem.discussions || []}
            onDiscussionAdded={(newDisc) => {
              const updated = {
                ...problem,
                discussions: [newDisc, ...(problem.discussions || [])]
              };
              setProblem(updated);
              if (onUpdate) onUpdate(updated);
            }}
          />
        </div>
      </div>
    </div>
  );
}
