import React from 'react';
import { Lightbulb, Target, Sparkles, Network } from 'lucide-react';

export default function InnovationHubPage() {
  const futureModules = [
    {
      title: 'Shortlisted Problems',
      icon: Target,
      desc: 'Curated high-impact civic challenges verified for technical and grassroots innovation.'
    },
    {
      title: 'Opportunities',
      icon: Sparkles,
      desc: 'Hackathons, civic grants, incubation programs, and municipal pilot opportunities.'
    },
    {
      title: 'Innovation Matching',
      icon: Network,
      desc: 'Direct matchmaking between vetted startup solutions and local governance bodies.'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 className="page-title">Innovation Hub</h1>
          <span
            style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Coming Soon
          </span>
        </div>
        <p className="page-description">
          Shortlisted and structured problems for innovators, startups, NGOs and institutions.
        </p>
      </div>

      {/* Main Coming Soon Banner */}
      <div
        className="card"
        style={{
          padding: '36px 28px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          marginBottom: '28px',
          border: '1px dashed var(--border-medium)'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            color: 'var(--civic-accent)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Lightbulb size={24} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Civic Problem Marketplace Under Development
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 20px' }}>
          This hub will enable research institutes, student innovators, and social enterprises to adopt verified citizen problems directly from the SolveMe database.
        </p>
        <div style={{ display: 'inline-block', backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: '#475569', fontWeight: 500 }}>
          Phase 2 Integration Roadmap • Smart India Hackathon
        </div>
      </div>

      {/* 3 Placeholder Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {futureModules.map((module, idx) => {
          const Icon = module.icon;
          return (
            <div
              key={idx}
              className="card"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                opacity: 0.9
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--civic-blue)',
                  marginBottom: '14px'
                }}
              >
                <Icon size={18} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {module.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {module.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
