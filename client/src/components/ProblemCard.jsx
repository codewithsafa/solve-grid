import React, { useState } from 'react';
import { MapPin, ArrowBigUp, MessageSquare, Info, Share2, Check } from 'lucide-react';
import { upvoteProblem } from '../services/api';

export default function ProblemCard({ problem, onClick, onUpvote }) {
  const [upvotes, setUpvotes] = useState(problem.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Parse hashtags into array
  const hashtagsArray = (problem.hashtags || '')
    .split(/[\s,]+/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0 && tag.startsWith('#'));

  const handleUpvoteClick = async (e) => {
    e.stopPropagation();
    if (hasUpvoted) return;

    try {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      const res = await upvoteProblem(problem.id);
      if (onUpvote) onUpvote(res);
    } catch (err) {
      console.error("Upvote failed:", err);
      // Revert if failed
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const url = window.location.origin + `/problems?id=${problem.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddInfoClick = (e) => {
    e.stopPropagation();
    onClick(problem, 'add-info');
  };

  const discussionsCount = problem.discussions ? problem.discussions.length : 0;

  return (
    <div className="problem-card" onClick={() => onClick(problem, 'view')}>
      {/* Card Media Preview (Image or Video) */}
      {(problem.imageUrl || problem.videoUrl) && (
        <div className="problem-card-media">
          {problem.imageUrl ? (
            <img
              src={problem.imageUrl}
              alt={problem.title}
              className="problem-card-img"
              loading="lazy"
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
            />
          ) : (
            <video
              src={problem.videoUrl}
              className="problem-card-img"
              muted
              playsInline
            />
          )}
          {problem.videoUrl && (
            <span
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(4px)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ▶ Reel
            </span>
          )}
        </div>
      )}

      <div className="problem-card-content">
        <div className="problem-card-header">
          <span className="badge-category">{problem.category}</span>
          <span className={`badge badge-${problem.status}`}>
            {problem.status.replace(/_/g, ' ')}
          </span>
        </div>

        <h3 className="problem-card-title">{problem.title}</h3>

        <div className="problem-card-location">
          <MapPin size={13} />
          <span>{problem.district}, {problem.state}</span>
        </div>

        <p className="problem-card-desc">{problem.description}</p>

        {hashtagsArray.length > 0 && (
          <div className="tag-list" style={{ marginBottom: '12px' }}>
            {hashtagsArray.map((tag, idx) => (
              <span key={idx} className="tag-item" style={{ fontSize: '11px', padding: '2px 6px' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="problem-card-footer">
          <div className="card-actions-group">
            {/* Upvote Button */}
            <button
              type="button"
              className={`action-btn ${hasUpvoted ? 'upvoted' : ''}`}
              onClick={handleUpvoteClick}
              title="Upvote this civic issue"
            >
              <ArrowBigUp size={15} fill={hasUpvoted ? "currentColor" : "none"} />
              <span>{upvotes}</span>
            </button>

            {/* Discussion Count / Action */}
            <button
              type="button"
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClick(problem, 'discuss');
              }}
              title="View or join discussion"
            >
              <MessageSquare size={13} />
              <span>{discussionsCount}</span>
            </button>
          </div>

          <div className="card-actions-group">
            {/* Add Information Shortcut */}
            <button
              type="button"
              className="action-btn"
              onClick={handleAddInfoClick}
              title="Contribute additional information"
            >
              <Info size={13} />
              <span>Add Info</span>
            </button>

            {/* Share Button */}
            <button
              type="button"
              className="action-btn"
              onClick={handleShareClick}
              title="Share issue link"
            >
              {copied ? <Check size={13} style={{ color: '#16a34a' }} /> : <Share2 size={13} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
