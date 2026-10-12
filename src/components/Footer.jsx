import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-disclaimer-box">
        <div className="disclaimer-header">
          <ShieldAlert size={18} className="disclaimer-icon" />
          <span className="disclaimer-title">Important Disclaimer</span>
        </div>
        <p className="disclaimer-text">
          This calculator is built for personal use and informational estimation only. It is not an official government calculator and does not represent any official authority (such as AGPR, Provincial Accountant General, or Ministry of Finance). For official pension sanctions, LPC (Last Pay Certificate), and final retirement settlements, please consult your respective Accounts Office or Departmental Pension Cell.
        </p>
      </div>
      <div className="footer-copyright">
        <span>Pakistan Civil Service Pension & Average Basic Pay Estimator</span>
        <span>•</span>
        <span>Personal Utility Tool</span>
      </div>
    </footer>
  );
}
