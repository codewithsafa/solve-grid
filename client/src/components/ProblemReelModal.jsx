import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowBigUp,
  MessageSquare,
  Info,
  Share2,
  MapPin,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Send,
  Check
} from 'lucide-react';
import { upvoteProblem, postDiscussion } from '../services/api';

export default function ProblemReelModal({
  problem,
  problemsList = [],
  isMoreInfoOpen = false,
  onClose,
  onOpenMoreInfo,
  onProblemUpdated,
  onNavigate
}) {
  const [upvotes, setUpvotes] = useState(problem.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Media controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Discussion Drawer / Overlay inside Reel
  const [showDiscussDrawer, setShowDiscussDrawer] = useState(false);
  const [discussions, setDiscussions] = useState(problem.discussions || []);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Expanded description toggle
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    setUpvotes(problem.upvotes || 0);
    setHasUpvoted(false);
    setDiscussions(problem.discussions || []);
    setIsDescExpanded(false);
    setShowDiscussDrawer(false);
    setIsPlaying(true);
  }, [problem.id]);

  const handleUpvote = async (e) => {
    e.stopPropagation();
    if (hasUpvoted) return;

    try {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      const updated = await upvoteProblem(problem.id);
      if (onProblemUpdated) onProblemUpdated(updated);
    } catch (err) {
      console.error(err);
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/problems?id=${problem.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const added = await postDiscussion(problem.id, newComment);
      const updatedList = [added, ...discussions];
      setDiscussions(updatedList);
      setNewComment('');
      if (onProblemUpdated) {
        onProblemUpdated({ ...problem, discussions: updatedList });
      }
    } catch (err) {
      alert("Failed to post comment: " + err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Pause video if More Info card comes up in front
  useEffect(() => {
    if (isMoreInfoOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isMoreInfoOpen]);

  // Keyboard navigation for reels (ArrowUp / ArrowDown / Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If More Info detail modal is open in front, let it handle its own key actions
      if (isMoreInfoOpen) return;

      if (e.key === 'Escape') {
        if (showDiscussDrawer) {
          setShowDiscussDrawer(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowDown' || e.key === 'j') {
        if (onNavigate) onNavigate(1);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        if (onNavigate) onNavigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, onClose, showDiscussDrawer, isMoreInfoOpen]);

  const currentIndex = problemsList.findIndex(p => p.id === problem.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < problemsList.length - 1 && currentIndex !== -1;

  // Extract hashtags
  const hashtagsArray = (problem.hashtags || '')
    .split(/[\s,]+/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0 && tag.startsWith('#'));

  const isVideo = Boolean(
    problem.videoUrl ||
    (problem.imageUrl && (problem.imageUrl.includes('.mp4') || problem.imageUrl.includes('data:video/')))
  );
  const mediaSrc = problem.videoUrl || problem.imageUrl;

  return (
    <div className="reel-modal-overlay" onClick={onClose}>
      <div className="reel-wrapper" onClick={(e) => e.stopPropagation()}>
        
        {/* Navigation Arrows on Desktop (Reel Switcher) */}
        <div className="reel-nav-controls">
          <button
            type="button"
            className="reel-nav-btn"
            disabled={!hasPrev}
            onClick={() => onNavigate && onNavigate(-1)}
            title="Previous Problem (Up Arrow)"
          >
            <ChevronUp size={22} />
          </button>
          <button
            type="button"
            className="reel-nav-btn"
            disabled={!hasNext}
            onClick={() => onNavigate && onNavigate(1)}
            title="Next Problem (Down Arrow)"
          >
            <ChevronDown size={22} />
          </button>
        </div>

        {/* Main Reel Viewport */}
        <div className="reel-container">
          
          {/* Top Header Bar inside Reel */}
          <div className="reel-top-bar">
            <div className="reel-badge-group">
              <span className="reel-tag">{problem.category}</span>
              <span className={`reel-status-pill reel-status-${problem.status}`}>
                ● {problem.status.replace(/_/g, ' ')}
              </span>
            </div>
            <button
              type="button"
              className="reel-icon-btn reel-close-btn"
              onClick={onClose}
              title="Close Reel"
            >
              <X size={20} />
            </button>
          </div>

          {/* Media Presentation Area */}
          <div className="reel-media-area" onClick={isVideo ? handleTogglePlay : undefined}>
            {isVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={mediaSrc}
                  className="reel-media-element"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />
                {!isPlaying && (
                  <div className="reel-play-indicator">
                    <Play size={36} fill="#ffffff" />
                  </div>
                )}
                {/* Audio Mute/Unmute toggle */}
                <button
                  type="button"
                  className="reel-mute-btn"
                  onClick={handleToggleMute}
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </>
            ) : problem.imageUrl ? (
              <img
                src={problem.imageUrl}
                alt={problem.title}
                className="reel-media-element"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              /* Civic Backdrop fallback if no image or video is uploaded */
              <div className="reel-civic-placeholder">
                <div className="reel-placeholder-icon">🏛️</div>
                <h4 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, margin: '8px 0' }}>
                  {problem.category}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                  Verified Citizen Civic Report
                </p>
              </div>
            )}

            {/* Dark Scrim Gradients for text readability */}
            <div className="reel-top-gradient" />
            <div className="reel-bottom-gradient" />
          </div>

          {/* Right-Side Action Column (Insta Reel Style) */}
          <div className="reel-actions-column">
            {/* 1. Upvote Button */}
            <button
              type="button"
              className={`reel-action-item ${hasUpvoted ? 'active' : ''}`}
              onClick={handleUpvote}
              title="Upvote this civic issue"
            >
              <div className="reel-action-circle">
                <ArrowBigUp size={24} fill={hasUpvoted ? "currentColor" : "none"} />
              </div>
              <span className="reel-action-label">{upvotes}</span>
            </button>

            {/* 2. Discuss Button */}
            <button
              type="button"
              className={`reel-action-item ${showDiscussDrawer ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowDiscussDrawer(!showDiscussDrawer);
              }}
              title="Open discussion"
            >
              <div className="reel-action-circle">
                <MessageSquare size={22} />
              </div>
              <span className="reel-action-label">{discussions.length}</span>
            </button>

            {/* 3. More Info Button -> Opens Full Problem Card Detail Modal */}
            <button
              type="button"
              className="reel-action-item highlight"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMoreInfo(problem);
              }}
              title="View Complete Problem Details, Resolution Timeline & Context"
            >
              <div className="reel-action-circle info-circle">
                <Info size={22} />
              </div>
              <span className="reel-action-label">More Info</span>
            </button>

            {/* 4. Share Button */}
            <button
              type="button"
              className="reel-action-item"
              onClick={handleShare}
              title="Share issue link"
            >
              <div className="reel-action-circle">
                {copied ? <Check size={20} color="#22c55e" /> : <Share2 size={22} />}
              </div>
              <span className="reel-action-label">{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          {/* Bottom Information & Description Scrim */}
          <div className="reel-bottom-content">
            <div className="reel-location-row">
              <MapPin size={13} />
              <span>{problem.district}, {problem.state}</span>
            </div>

            <h2 className="reel-title">{problem.title}</h2>

            {/* Brief Description & Status format */}
            <div className="reel-desc-container">
              <p className={`reel-description ${isDescExpanded ? 'expanded' : ''}`}>
                {problem.description}
              </p>
              {problem.description.length > 80 && (
                <button
                  type="button"
                  className="reel-more-toggle"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                >
                  {isDescExpanded ? 'less' : 'more'}
                </button>
              )}
            </div>

            {/* Hashtags */}
            {hashtagsArray.length > 0 && (
              <div className="reel-hashtags">
                {hashtagsArray.map((tag, idx) => (
                  <span key={idx} className="reel-hash-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Slide-Up Discussion Drawer inside the Reel */}
          {showDiscussDrawer && (
            <div className="reel-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="reel-drawer-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={16} />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>
                    Discussion ({discussions.length})
                  </span>
                </div>
                <button
                  type="button"
                  className="reel-icon-btn"
                  onClick={() => setShowDiscussDrawer(false)}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Discussions List */}
              <div className="reel-drawer-body">
                {discussions.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>
                    No comments yet. Be the first to share an update.
                  </p>
                ) : (
                  discussions.map((d, i) => (
                    <div key={d.id || i} className="reel-comment-item">
                      <div className="reel-comment-author">
                        Citizen Contributor
                      </div>
                      <div className="reel-comment-text">{d.content}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Post Comment Input */}
              <form className="reel-drawer-footer" onSubmit={handlePostComment}>
                <input
                  type="text"
                  className="reel-comment-input"
                  placeholder="Add to discussion..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={submittingComment}
                />
                <button
                  type="submit"
                  className="reel-send-btn"
                  disabled={submittingComment || !newComment.trim()}
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
