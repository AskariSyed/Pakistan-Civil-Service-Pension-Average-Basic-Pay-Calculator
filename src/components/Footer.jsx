import React from 'react';
import { ShieldAlert, Scale } from 'lucide-react';

export default function Footer({ onOpenDisclaimer }) {
  return (
    <footer className="app-footer">
      <div className="footer-disclaimer-box">
        <div className="disclaimer-header">
          <ShieldAlert size={18} className="disclaimer-icon" />
          <span className="disclaimer-title">Important Legal Disclaimer</span>
        </div>
        <p className="disclaimer-text">
          This calculator is built for personal use and informational estimation only. It is not an official government calculator and does not represent any official authority (such as AGPR, Provincial Accountant General, or Ministry of Finance). For official pension sanctions, LPC (Last Pay Certificate), and final retirement settlements, please consult your respective Accounts Office or Departmental Pension Cell.
        </p>
        {onOpenDisclaimer && (
          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={onOpenDisclaimer}
            >
              <Scale size={13} color="#f59e0b" />
              <span>Read Full Legal Terms & Liability Waiver</span>
            </button>
          </div>
        )}
      </div>
      <div className="footer-copyright">
        <span>Pakistan Civil Service Pension & Average Basic Pay Estimator</span>
        <span>•</span>
        <span>Personal Utility Tool • All Rights Reserved</span>
      </div>
    </footer>
  );
}
