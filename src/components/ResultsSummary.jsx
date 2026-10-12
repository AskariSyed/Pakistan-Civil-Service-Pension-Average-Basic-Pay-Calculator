import React, { useState } from 'react';
import { Copy, Check, TrendingUp, FileSpreadsheet, Calendar, Layers, Sparkles } from 'lucide-react';

export default function ResultsSummary({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result || !result.isValid) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <p>Please enter valid employee details to view the 24-month calculation results.</p>
      </div>
    );
  }

  const {
    avgRound,
    avgTotal,
    totalBasic,
    totalPP,
    totalSum,
    months,
    bps,
    bpsLabel,
    retirementScaleYear
  } = result;

  const firstMonth = months[0]?.monthName || '';
  const lastMonth = months[months.length - 1]?.monthName || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(avgRound.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Hero Result Card */}
      <div className="hero-result-card">
        <div className="hero-result-header">
          <div className="hero-result-label">
            <TrendingUp size={16} />
            <span>Average of Last 24 Months Basic Pay</span>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            title="Copy rounded average amount"
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Amount'}</span>
          </button>
        </div>

        <div className="hero-amount-wrapper">
          <span className="hero-currency">PKR</span>
          <span className="hero-amount">{avgRound.toLocaleString()}</span>
          <span className="hero-amount-exact">
            (Exact: PKR {avgTotal.toFixed(2)})
          </span>
        </div>

        <div className="hero-meta-badges">
          <span className="meta-badge highlight">
            <Calendar size={13} />
            24-Month Window: {firstMonth} – {lastMonth}
          </span>
          <span className="meta-badge">
            <Layers size={13} />
            {bpsLabel} • {retirementScaleYear} Scale at Retirement
          </span>
          <span className="meta-badge">
            <FileSpreadsheet size={13} />
            Official Excel Formula Match
          </span>
        </div>
      </div>

      {/* 3 Secondary Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total 24M Basic Pay</div>
          <div className="stat-value">Rs. {totalBasic.toLocaleString()}</div>
          <div className="stat-sub">Sum of Column G (Basic Pay)</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Personal Pay (PP)</div>
          <div className="stat-value" style={{ color: totalPP > 0 ? 'var(--amber-500)' : 'inherit' }}>
            Rs. {totalPP.toLocaleString()}
          </div>
          <div className="stat-sub">Sum of Column H (Personal Pay)</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Combined (24M)</div>
          <div className="stat-value" style={{ color: 'var(--emerald-500)' }}>
            Rs. {totalSum.toLocaleString()}
          </div>
          <div className="stat-sub">Sum of Column I (Total Basic + PP)</div>
        </div>
      </div>
    </div>
  );
}
