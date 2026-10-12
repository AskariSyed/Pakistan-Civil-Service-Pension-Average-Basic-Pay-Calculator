import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

export default function DisclaimerBanner({ onOpenFullDisclaimer }) {
  return (
    <aside className="disclaimer-ticker-wrapper" aria-label="Legal Notice">
      <div className="ticker-badge">
        <AlertTriangle size={14} className="ticker-icon" />
        <span>LEGAL NOTICE</span>
      </div>
      <div className="ticker-track">
        <span className="ticker-text">
          ⚠️ <strong>Unofficial Utility Tool:</strong> This calculator is strictly for personal estimation & informational planning. It is NOT an official government calculator and does NOT represent AGPR, Provincial Accountant General, or Ministry of Finance. The website creator accepts NO liability for calculations.
        </span>
      </div>
      <button
        type="button"
        className="ticker-details-btn"
        onClick={onOpenFullDisclaimer}
      >
        <span>Full Terms</span>
        <ExternalLink size={12} />
      </button>
    </aside>
  );
}
