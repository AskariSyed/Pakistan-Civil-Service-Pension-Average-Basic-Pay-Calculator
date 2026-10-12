import React, { useState } from 'react';
import { PAY_SCALES } from '../data/payScales.js';
import { X, Search, Table } from 'lucide-react';

export default function PayScaleModal({ isOpen, onClose }) {
  const [filterBps, setFilterBps] = useState('');

  if (!isOpen) return null;

  const bpsList = Object.values(PAY_SCALES).filter((item) => {
    if (!filterBps) return true;
    return item.bps.toString().includes(filterBps) || item.bpsLabel.toLowerCase().includes(filterBps.toLowerCase());
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Table size={22} color="#10b981" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Revised Pay Scale Chart (2022 vs 2026)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Official initial, increment, and maximum pay for Basic Pay Scales (BPS-01 to BPS-22)
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Filter Input */}
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Filter by BPS (e.g. 16, 17)..."
            value={filterBps}
            onChange={(e) => setFilterBps(e.target.value)}
            style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
          />
        </div>

        {/* Comparison Table */}
        <div className="table-wrapper">
          <table className="breakdown-table">
            <thead>
              <tr>
                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>BPS</th>
                <th colSpan={3} style={{ textAlign: 'center', background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc' }}>
                  Pay Scale 2022 (PKR)
                </th>
                <th colSpan={3} style={{ textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                  Pay Scale 2026 (PKR)
                </th>
              </tr>
              <tr>
                <th className="num-col">Initial</th>
                <th className="num-col">Inc.</th>
                <th className="num-col">Maximum</th>
                <th className="num-col">Initial</th>
                <th className="num-col">Inc.</th>
                <th className="num-col">Maximum</th>
              </tr>
            </thead>
            <tbody>
              {bpsList.map((item) => (
                <tr key={item.bps}>
                  <td style={{ fontWeight: 700, color: 'var(--emerald-500)' }}>{item.bpsLabel}</td>
                  <td className="num-col">Rs. {item.scale2022.initial.toLocaleString()}</td>
                  <td className="num-col" style={{ color: 'var(--text-muted)' }}>+{item.scale2022.increment.toLocaleString()}</td>
                  <td className="num-col">Rs. {item.scale2022.maximum.toLocaleString()}</td>

                  <td className="num-col" style={{ fontWeight: 600 }}>Rs. {item.scale2026.initial.toLocaleString()}</td>
                  <td className="num-col" style={{ color: 'var(--emerald-500)' }}>+{item.scale2026.increment.toLocaleString()}</td>
                  <td className="num-col" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    Rs. {item.scale2026.maximum.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
