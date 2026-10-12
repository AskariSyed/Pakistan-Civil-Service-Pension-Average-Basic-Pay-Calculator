import React from 'react';
import { Layers } from 'lucide-react';

export default function BreakdownTable({ months, totalBasic, totalPP, totalSum, avgBasic, avgPP, avgTotal, avgRound }) {
  if (!months || months.length === 0) return null;

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div className="card-header" style={{ marginBottom: '14px' }}>
        <h3 className="card-title">
          <Layers className="card-title-icon" size={18} />
          <span>Month-wise Basic Pay & PP – Last 24 Months</span>
        </h3>
        <span className="meta-badge">
          24 Total Months
        </span>
      </div>

      <div className="table-wrapper">
        <table className="breakdown-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Sr No</th>
              <th>Month</th>
              <th>Pay Scale</th>
              <th className="num-col">Stage</th>
              <th className="num-col">Basic Pay (PKR)</th>
              <th className="num-col">Personal Pay (PKR)</th>
              <th className="num-col" style={{ color: 'var(--emerald-500)' }}>Total Basic + PP (PKR)</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={m.srNo}>
                <td style={{ color: 'var(--text-muted)' }}>{m.srNo}</td>
                <td style={{ fontWeight: 600 }}>{m.monthName}</td>
                <td>
                  <span className={`badge-scale ${m.scaleYear === 2026 ? 'badge-scale-2026' : 'badge-scale-2022'}`}>
                    Scale {m.scaleYear}
                  </span>
                </td>
                <td className="num-col" style={{ color: 'var(--text-secondary)' }}>
                  {m.stages}
                </td>
                <td className="num-col">Rs. {m.basicPay.toLocaleString()}</td>
                <td className="num-col" style={{ color: m.personalPay > 0 ? 'var(--amber-500)' : 'var(--text-muted)' }}>
                  {m.personalPay > 0 ? `Rs. ${m.personalPay.toLocaleString()}` : '-'}
                </td>
                <td className="num-col" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  Rs. {m.totalPay.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {/* Total Row */}
            <tr>
              <td colSpan={4} style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total (24 Months)
              </td>
              <td className="num-col">Rs. {totalBasic.toLocaleString()}</td>
              <td className="num-col" style={{ color: totalPP > 0 ? 'var(--amber-500)' : 'inherit' }}>
                Rs. {totalPP.toLocaleString()}
              </td>
              <td className="num-col" style={{ color: 'var(--emerald-500)' }}>
                Rs. {totalSum.toLocaleString()}
              </td>
            </tr>
            {/* Average Row */}
            <tr style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
              <td colSpan={4} style={{ fontWeight: 800, color: 'var(--emerald-500)' }}>
                Average (24 Months)
              </td>
              <td className="num-col">Rs. {avgBasic.toFixed(2)}</td>
              <td className="num-col">Rs. {avgPP.toFixed(2)}</td>
              <td className="num-col" style={{ color: 'var(--emerald-500)', fontSize: '1rem', fontWeight: 800 }}>
                Rs. {avgRound.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>({avgTotal.toFixed(2)})</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
