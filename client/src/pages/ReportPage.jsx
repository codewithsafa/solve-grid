import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, CheckCircle2, ArrowRight, X, AlertCircle } from 'lucide-react';
import { createProblem } from '../services/api';

const CATEGORIES = [
  'Civic Infrastructure',
  'Sanitation',
  'Transport',
  'Public Safety',
  'Healthcare',
  'Environment',
  'Education',
  'Other'
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function ReportPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Civic Infrastructure');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState(['#civicissue']);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submittedProblem, setSubmittedProblem] = useState(null);

  // Handle adding hashtag
  const handleAddHashtag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCurrentTag();
    }
  };

  const addCurrentTag = () => {
    let tag = hashtagInput.trim();
    if (!tag) return;
    if (!tag.startsWith('#')) {
      tag = `#${tag}`;
    }
    tag = tag.replace(/\s+/g, '');
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
    setHashtagInput('');
  };

  const removeTag = (indexToRemove) => {
    setHashtags(hashtags.filter((_, i) => i !== indexToRemove));
  };

  // Simple local image upload handler (converts to base64 DataURL for prototype)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (max 5MB for local base64)
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !district.trim()) {
      setError("Please fill in all mandatory fields: Title, Description, District, and State.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        state,
        district: district.trim(),
        hashtags: hashtags.join(' '),
        imageUrl: imagePreview,
        videoUrl: videoUrl.trim() || null
      };

      const result = await createProblem(payload);
      setSubmittedProblem(result);
    } catch (err) {
      setError(err.message || "Failed to submit problem");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Report a Civic Problem</h1>
        <p className="page-description">
          Submit details about a real-world issue in your locality so citizens, innovators, and authorities can act on it.
        </p>
      </div>

      {/* Success Notification Banner */}
      {submittedProblem && (
        <div className="alert-success">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} />
            <div>
              <strong>Problem Successfully Reported!</strong>
              <div style={{ fontSize: '12px', marginTop: '2px' }}>
                Your report has been logged with initial status <strong>SUBMITTED</strong>.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/problems?id=${submittedProblem.id}`)}
          >
            <span>View Submitted Problem</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Problem Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="prob-title">
              Problem Title *
            </label>
            <input
              id="prob-title"
              type="text"
              className="form-input"
              placeholder="e.g. Drainage water accumulating near university gate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <span className="form-helper">Be concise and specific about what and where the issue is.</span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="prob-desc">
              Description *
            </label>
            <textarea
              id="prob-desc"
              className="form-textarea"
              placeholder="Describe the problem, severity, duration, and how it impacts citizens or public movement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Category & Location Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="prob-category">
                Category *
              </label>
              <select
                id="prob-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="form-group">
              <label className="form-label" htmlFor="prob-state">
                State *
              </label>
              <select
                id="prob-state"
                className="form-select"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label" htmlFor="prob-district">
                District *
              </label>
              <input
                id="prob-district"
                type="text"
                className="form-input"
                placeholder="e.g. Aligarh, Bengaluru, Bhopal"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Hashtags */}
          <div className="form-group">
            <label className="form-label" htmlFor="prob-tags">
              Hashtags
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="prob-tags"
                type="text"
                className="form-input"
                placeholder="Type tag (e.g. drainage, roads) and press Enter or click Add"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleAddHashtag}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addCurrentTag}
              >
                Add Tag
              </button>
            </div>
            
            {/* Hashtag Pills */}
            <div className="tag-list">
              {hashtags.map((tag, idx) => (
                <span key={idx} className="tag-item">
                  {tag}
                  <span className="tag-remove" onClick={() => removeTag(idx)}>×</span>
                </span>
              ))}
            </div>
            <span className="form-helper">Tags help categorize issues and connect related civic concerns.</span>
          </div>

          {/* Optional Image */}
          <div className="form-group">
            <label className="form-label">
              Optional Image
            </label>
            <div
              style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#fcfdfd'
              }}
            >
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: 'var(--radius-sm)', marginBottom: '10px' }}
                  />
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setImagePreview(null)}
                    >
                      <X size={14} />
                      <span>Remove Photo</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label style={{ cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Upload size={24} color="var(--text-muted)" />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Click to select an image from your device
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                    PNG, JPG or WebP (up to 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Optional Video / Reel URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="prob-video">
              Optional Video URL (For Reel playback)
            </label>
            <input
              id="prob-video"
              type="url"
              className="form-input"
              placeholder="e.g. https://... or .mp4 video link of the ground issue"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <span className="form-helper">
              If a video is provided, the problem card will play it directly in full Reel mode.
            </span>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              <PlusCircle size={18} />
              <span>{submitting ? 'Submitting Report...' : 'Report Problem'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
