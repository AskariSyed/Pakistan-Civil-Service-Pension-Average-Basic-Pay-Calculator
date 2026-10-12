import React from 'react';
import { ShieldAlert, CheckCircle, X, Scale } from 'lucide-react';

export default function DisclaimerModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content disclaimer-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="disclaimer-modal-icon">
              <Scale size={24} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Legal Disclaimer & Terms of Use
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Please review before using this calculation tool
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="disclaimer-body">
          <div className="disclaimer-callout">
            <ShieldAlert size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Notice of Non-Affiliation:</strong>
              <p style={{ marginTop: 4 }}>
                This web application is an <strong>independent, unofficial tool</strong> developed solely for personal informational reference and educational estimation. It is <strong>NOT affiliated, authorized, endorsed, or associated with</strong> the Government of Pakistan, the Ministry of Finance, the Accountant General Pakistan Revenues (AGPR), or any Provincial Accountant General (AG) office.
              </p>
            </div>
          </div>

          <div className="disclaimer-terms-list">
            <div className="term-item">
              <span className="term-number">1</span>
              <div>
                <h4 className="term-title">Estimations Only</h4>
                <p className="term-desc">
                  All calculations (including 24-Month Average Basic Pay, Commutation Lump-Sum, and Net Pension) are computer-generated approximations based on public formulas. They do not constitute an official Pension Sanction, Last Pay Certificate (LPC), or legal entitlement.
                </p>
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">2</span>
              <div>
                <h4 className="term-title">No Legal Liability or Warranty</h4>
                <p className="term-desc">
                  The website owner, author, and operators expressly disclaim all warranties (express or implied) and accept <strong>no legal, financial, or administrative liability</strong> for errors, omissions, or differences between this tool’s outputs and official calculations made by Departmental Accounts Offices or AGPR.
                </p>
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">3</span>
              <div>
                <h4 className="term-title">Official Authorities Prevail</h4>
                <p className="term-desc">
                  Final and legally binding pension entitlements are determined strictly by the competent Pension Sanctioning Authority, based on your official Service Book, verified LPC, and formal Audit verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderColor: '#d97706', color: '#0f172a', fontWeight: 700 }}
            onClick={onAccept}
          >
            <CheckCircle size={16} />
            <span>I Understand & Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
}
