import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlusCircle, Compass, Lightbulb, Activity, BarChart2, Shield } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Report', path: '/report', icon: PlusCircle },
    { name: 'Problems', path: '/problems', icon: Compass },
    { name: 'Innovation Hub', path: '/hub', icon: Lightbulb },
    { name: 'Track Problems', path: '/track', icon: Activity },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart2 }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <NavLink to="/" className="brand-logo">
            <div className="brand-icon">
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="brand-title">SolveMe</span>
              <span className="brand-badge">SIH '26</span>
            </div>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Citizen Problem Discovery</p>
          <p style={{ fontSize: '11px', marginTop: '2px' }}>Open Civic Intelligence Platform</p>
        </div>
      </aside>

      {/* Mobile Responsive Bottom Navigation */}
      <nav className="mobile-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
