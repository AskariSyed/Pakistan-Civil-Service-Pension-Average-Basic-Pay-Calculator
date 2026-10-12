import React from 'react';
import { Calendar, TrendingUp, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function RulesExplainer() {
  return (
    <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '16px' }}>
        <h3 className="card-title">
          <HelpCircle className="card-title-icon" size={20} />
          <span>Understanding the Calculation Formulas & Rules</span>
        </h3>
        <span className="meta-badge highlight">
          Official Government Rules
        </span>
      </div>

      <div className="rules-grid">
        <div className="rule-card">
          <div className="rule-title">
            <TrendingUp size={16} color="#10b981" />
            <span>24-Month Average Basic Pay</span>
          </div>
          <p className="rule-desc">
            As per recent Federal and Provincial Pension Regulations, pension calculation is based on the average emoluments drawn during the last 24 months of active service immediately preceding retirement:
            <code style={{ display: 'block', marginTop: '6px', padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
              Average = ROUND(SUM(Months 1 to 24) / 24, 0)
            </code>
          </p>
        </div>

        <div className="rule-card">
          <div className="rule-title">
            <Calendar size={16} color="#3b82f6" />
            <span>1st December Increment Rule</span>
          </div>
          <p className="rule-desc">
            Civil servants draw their regular annual increment on the 1st of December. The formula mathematically traces back the stages by deducting increments for past Decembers:
            <code style={{ display: 'block', marginTop: '6px', padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
              Inc_Diff = (Year_Ret - Year_m) + Dec_Adj
            </code>
          </p>
        </div>

        <div className="rule-card">
          <div className="rule-title">
            <Layers size={16} color="#6366f1" />
            <span>Scale Revision on 01-Jul-2026</span>
          </div>
          <p className="rule-desc">
            If retirement is after July 2026, the 24-month period straddles both the 2022 and 2026 pay scales. Months before July 2026 automatically calculate pay using the 2022 Scale, while subsequent months use the 2026 Scale.
          </p>
        </div>

        <div className="rule-card">
          <div className="rule-title">
            <CheckCircle2 size={16} color="#f59e0b" />
            <span>Personal Pay (PP) at Ceiling</span>
          </div>
          <p className="rule-desc">
            Personal Pay (PP) is granted when an employee has reached the maximum ceiling of their basic pay scale. The Excel formula verifies that PP is a multiple of the annual increment and accounts for it in past months.
          </p>
        </div>
      </div>
    </div>
  );
}
