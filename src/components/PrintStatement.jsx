import React from 'react';
import { calculatePensionBenefits } from '../utils/calculator.js';

export default function PrintStatement({ result, bps, lastBasicPay, personalPay, retirementDate }) {
  if (!result || !result.isValid) return null;

  const {
    avgRound,
    avgTotal,
    avgBasic,
    avgPP,
    totalBasic,
    totalPP,
    totalSum,
    months,
    bpsLabel,
    retirementScaleYear
  } = result;

  const retDateObj = new Date(retirementDate);
  const formattedRetDate = retDateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const currentDateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Calculate standard pension estimate for 30 years service at age 60/61
  const pensionEstimate = calculatePensionBenefits(avgRound, 30, 61, 35);
  const medicalRate = bps <= 15 ? 0.25 : 0.20;
  const medicalAllowance = Math.round(pensionEstimate.netPension * medicalRate);
  const totalMonthly = pensionEstimate.netPension + medicalAllowance;

  return (
    <div className="print-statement-document" id="print-statement">
      {/* Print Document Header */}
      <div className="print-header">
        <div className="print-title-group">
          <h1 className="print-title">24-MONTH AVERAGE BASIC PAY & PENSION STATEMENT</h1>
          <p className="print-subtitle">
            Calculated in accordance with Federal / Provincial Pension Rules & Revised Pay Scales
          </p>
        </div>
        <div className="print-meta-date">
          <strong>Statement Date:</strong> {currentDateStr}
        </div>
      </div>

      {/* Employee Particulars Grid */}
      <div className="print-particulars-box">
        <h2 className="print-section-heading">1. Employee & Pay Scale Particulars</h2>
        <div className="print-particulars-grid">
          <div className="particular-item">
            <span className="p-label">BPS of Employee:</span>
            <span className="p-val">{bpsLabel}</span>
          </div>
          <div className="particular-item">
            <span className="p-label">Date of Retirement:</span>
            <span className="p-val">{formattedRetDate}</span>
          </div>
          <div className="particular-item">
            <span className="p-label">Last Basic Pay Drawn:</span>
            <span className="p-val">PKR {Number(lastBasicPay).toLocaleString()} (Stage {result.retirementStage})</span>
          </div>
          <div className="particular-item">
            <span className="p-label">Personal Pay (PP):</span>
            <span className="p-val">PKR {Number(personalPay || 0).toLocaleString()}</span>
          </div>
          <div className="particular-item">
            <span className="p-label">Pay Scale at Retirement:</span>
            <span className="p-val">{retirementScaleYear} Revised Scale</span>
          </div>
          <div className="particular-item highlight">
            <span className="p-label">24-Month Average Basic Pay:</span>
            <span className="p-val bold">PKR {avgRound.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Detailed 24-Month Table */}
      <div className="print-table-section">
        <h2 className="print-section-heading">
          2. Month-wise Basic Pay & Personal Pay Schedule (Last 24 Months)
        </h2>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: '45px' }}>Sr</th>
              <th>Month</th>
              <th>Scale</th>
              <th className="num">Stage</th>
              <th className="num">Basic Pay (PKR)</th>
              <th className="num">Personal Pay (PKR)</th>
              <th className="num">Total Pay (PKR)</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={m.srNo}>
                <td style={{ textAlign: 'center' }}>{m.srNo}</td>
                <td><strong>{m.monthName}</strong></td>
                <td>{m.scaleYear}</td>
                <td className="num">{m.stages}</td>
                <td className="num">PKR {m.basicPay.toLocaleString()}</td>
                <td className="num">{m.personalPay > 0 ? `PKR ${m.personalPay.toLocaleString()}` : '-'}</td>
                <td className="num bold">PKR {m.totalPay.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="tfoot-total">
              <td colSpan={4} className="bold">TOTAL (SUM OF 24 MONTHS)</td>
              <td className="num bold">PKR {totalBasic.toLocaleString()}</td>
              <td className="num bold">{totalPP > 0 ? `PKR ${totalPP.toLocaleString()}` : '0'}</td>
              <td className="num bold">PKR {totalSum.toLocaleString()}</td>
            </tr>
            <tr className="tfoot-avg">
              <td colSpan={4} className="bold">AVERAGE BASIC PAY (TOTAL ÷ 24)</td>
              <td className="num">PKR {avgBasic.toFixed(2)}</td>
              <td className="num">PKR {avgPP.toFixed(2)}</td>
              <td className="num bold primary">PKR {avgRound.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pension & Commutation Summary */}
      <div className="print-pension-section">
        <h2 className="print-section-heading">3. Pension & Commutation Estimate (30 Years Service, Age 60/61)</h2>
        <div className="print-pension-grid">
          <div className="pension-box-item">
            <span className="p-label">Gross Pension (70%):</span>
            <span className="p-val">PKR {pensionEstimate.grossPension.toLocaleString()}</span>
          </div>
          <div className="pension-box-item">
            <span className="p-label">Commutation Surrendered (35%):</span>
            <span className="p-val">PKR {pensionEstimate.commutationPortion.toLocaleString()}</span>
          </div>
          <div className="pension-box-item highlight">
            <span className="p-label">Lump Sum Gratuity (Commutation Value):</span>
            <span className="p-val bold">PKR {pensionEstimate.commutationLumpSum.toLocaleString()}</span>
          </div>
          <div className="pension-box-item">
            <span className="p-label">Net Monthly Pension (65%):</span>
            <span className="p-val">PKR {pensionEstimate.netPension.toLocaleString()}</span>
          </div>
          <div className="pension-box-item">
            <span className="p-label">Estimated Medical Allowance ({Math.round(medicalRate * 100)}%):</span>
            <span className="p-val">PKR {medicalAllowance.toLocaleString()}</span>
          </div>
          <div className="pension-box-item highlight">
            <span className="p-label">Total Monthly Pension Payable (Approx.):</span>
            <span className="p-val bold">PKR {totalMonthly.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Disclaimer in Print Footer */}
      <div className="print-disclaimer-box">
        <strong>⚠️ DISCLAIMER:</strong> This statement has been generated for personal estimation and planning purposes only. It is not an official government calculator or a formal pension sanction. Official pension orders and final entitlements are issued solely by the competent pension sanctioning authorities, Accountant General Pakistan Revenues (AGPR), or respective Provincial Accountant General Offices.
      </div>
    </div>
  );
}
