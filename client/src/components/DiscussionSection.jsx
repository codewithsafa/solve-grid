import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { postDiscussion } from '../services/api';

export default function DiscussionSection({ problemId, initialDiscussions = [], onDiscussionAdded }) {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const newComment = await postDiscussion(problemId, content);
      setDiscussions([newComment, ...discussions]);
      setContent('');
      if (onDiscussionAdded) {
        onDiscussionAdded(newComment);
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
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="content-section">
      <div className="section-heading">
        <MessageSquare size={16} />
        <span>Community Discussion ({discussions.length})</span>
      </div>

      {/* Discussion Input */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Add to discussion... (e.g. Anyone else facing this issue near the area?)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={submitting || !content.trim()}
          >
            <Send size={14} />
            <span>{submitting ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
        {error && <p style={{ color: '#b91c1c', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
      </form>

      {/* Discussions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {discussions.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No comments yet. Start the community discussion above.
          </p>
        ) : (
          discussions.map((d, idx) => (
            <div key={d.id || idx} className="comment-box">
              <div className="comment-meta">
                Citizen Contributor • {formatDate(d.createdAt)}
              </div>
              <div className="comment-text">{d.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
