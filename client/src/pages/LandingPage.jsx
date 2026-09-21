import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%' }}>
        {/* Brand Icon & Name */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'var(--civic-blue)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Shield size={24} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--civic-blue)', letterSpacing: '-0.5px' }}>
            SolveMe
          </span>
        </div>

        {/* Primary Tagline */}
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
            lineHeight: 1.2,
            marginBottom: '16px'
          }}
        >
          See a problem? Report it.
        </h1>

        {/* Supporting Sentence */}
        <p
          style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '36px'
          }}
        >
          Report problems around you, add useful information, and help bring real-world issues to the people who can solve them.
        </p>

        {/* Prominent Action Button */}
        <div>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/problems')}
            style={{ padding: '14px 32px', fontSize: '17px' }}
          >
            <span>Get Started</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Subdued civic note */}
        <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '48px' }}>
          National Civic Problem Discovery Platform • SIH Initial Functional Prototype
        </p>
      </div>
    </div>
  );
}
