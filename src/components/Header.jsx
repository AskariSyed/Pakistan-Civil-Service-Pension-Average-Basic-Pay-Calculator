import React from 'react';
import { Calculator, Moon, Sun, Table, Printer, Sparkles, BookOpen } from 'lucide-react';

export default function Header({ theme, toggleTheme, onOpenPayScaleModal, onPrint, onToggleRules, showRules }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <Calculator size={28} strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="brand-title">Pakistan Pension & Average Basic Pay Calculator</h1>
          <p className="brand-subtitle">
            <span>Official 24-Month Average Formula</span>
            <span>•</span>
            <span>Revised Pay Scales (2022 vs 2026)</span>
            <span>•</span>
            <span style={{ color: 'var(--emerald-500)', fontWeight: 600 }}>BPS 1 to 22</span>
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn btn-secondary"
          onClick={onOpenPayScaleModal}
          title="View 2022 & 2026 Pay Scale Chart"
        >
          <Table size={16} />
          <span>Pay Scale Chart</span>
        </button>

        <button
          className={`btn ${showRules ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleRules}
          title="Learn Calculation Rules & Formulas"
        >
          <BookOpen size={16} />
          <span>Rules & Formula</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={onPrint}
          title="Print or Export Calculation Summary"
        >
          <Printer size={16} />
          <span>Print / PDF</span>
        </button>

        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
