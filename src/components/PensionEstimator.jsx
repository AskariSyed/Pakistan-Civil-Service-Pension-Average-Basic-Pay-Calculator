import React, { useState, useMemo } from 'react';
import { calculatePensionBenefits, COMMUTATION_TABLE } from '../utils/calculator.js';
import { ShieldCheck, Award, Calculator, Clock, HelpCircle } from 'lucide-react';

export default function PensionEstimator({ avgBasicPay, bps }) {
  const [serviceYears, setServiceYears] = useState(30);
  const [ageNextBirthday, setAgeNextBirthday] = useState(61);
  const [commutationPercentage, setCommutationPercentage] = useState(35);

  const pension = useMemo(() => {
    return calculatePensionBenefits(avgBasicPay, serviceYears, ageNextBirthday, commutationPercentage);
  }, [avgBasicPay, serviceYears, ageNextBirthday, commutationPercentage]);

  // Medical allowance in Pakistan:
  // 25% for BPS 1-15, 20% for BPS 16-22 on Net Pension (minimum Rs. 2,000 / Rs. 2,500)
  const medicalRate = bps <= 15 ? 0.25 : 0.20;
  const medicalAllowance = Math.round(pension.netPension * medicalRate);
  const totalMonthlyPension = pension.netPension + medicalAllowance;

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="card-header">
        <h3 className="card-title">
          <ShieldCheck className="card-title-icon" size={20} />
          <span>Full Pension & Commutation Estimates</span>
        </h3>
        <span className="meta-badge highlight">
          Based on 24-Month ABP: Rs. {avgBasicPay.toLocaleString()}
        </span>
      </div>

      <div className="pension-calc-card">
        {/* Left Side: Sliders / Inputs */}
        <div>
          {/* Qualifying Service */}
          <div className="slider-group">
            <div className="slider-header">
              <span>Length of Qualifying Service:</span>
              <span className="slider-val">{serviceYears} Years (Max 30)</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="10"
              max="30"
              value={serviceYears}
              onChange={(e) => setServiceYears(Number(e.target.value))}
            />
            <div className="input-hint">
              Minimum pensionable service is 10 years; capped at 30 years for 70% rate.
            </div>
          </div>

          {/* Age Next Birthday */}
          <div className="slider-group">
            <div className="slider-header">
              <span>Age Next Birthday at Retirement:</span>
              <span className="slider-val">{ageNextBirthday} Years</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="40"
              max="65"
              value={ageNextBirthday}
              onChange={(e) => setAgeNextBirthday(Number(e.target.value))}
            />
            <div className="input-hint">
              Superannuation retirement at 60 corresponds to Age Next Birthday 61 (Factor: {COMMUTATION_TABLE[ageNextBirthday] || 15.1170}).
            </div>
          </div>

          {/* Commutation % */}
          <div className="slider-group">
            <div className="slider-header">
              <span>Commutation Percentage:</span>
              <span className="slider-val">{commutationPercentage}% (Standard 35%)</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="0"
              max="35"
              step="5"
              value={commutationPercentage}
              onChange={(e) => setCommutationPercentage(Number(e.target.value))}
            />
            <div className="input-hint">
              Civil servants may commute up to 35% of gross pension into a lump-sum gratuity payment.
            </div>
          </div>
        </div>

        {/* Right Side: Calculated Benefits Box */}
        <div className="pension-summary-box">
          <div className="pension-row">
            <span style={{ color: 'var(--text-secondary)' }}>Gross Pension (70% max):</span>
            <span className="pension-val">Rs. {pension.grossPension.toLocaleString()}</span>
          </div>

          <div className="pension-row">
            <span style={{ color: 'var(--text-secondary)' }}>Commutation Surrendered ({commutationPercentage}%):</span>
            <span className="pension-val" style={{ color: 'var(--amber-500)' }}>
              Rs. {pension.commutationPortion.toLocaleString()}
            </span>
          </div>

          <div className="pension-row highlight">
            <div>
              <div style={{ fontWeight: 700, color: 'var(--emerald-500)' }}>Lump Sum Commutation Value</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Commutation × 12 × {pension.commutationFactor}
              </div>
            </div>
            <span className="pension-val primary">
              Rs. {pension.commutationLumpSum.toLocaleString()}
            </span>
          </div>

          <div className="pension-row">
            <span style={{ color: 'var(--text-secondary)' }}>Net Monthly Pension (65%):</span>
            <span className="pension-val">Rs. {pension.netPension.toLocaleString()}</span>
          </div>

          <div className="pension-row">
            <span style={{ color: 'var(--text-secondary)' }}>
              Estimated Medical Allowance ({Math.round(medicalRate * 100)}%):
            </span>
            <span className="pension-val">Rs. {medicalAllowance.toLocaleString()}</span>
          </div>

          <div className="pension-row" style={{ borderTop: '2px solid var(--border-medium)', marginTop: '8px', paddingTop: '12px' }}>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                Total Monthly Pension (Approx.)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Excluding adhoc relief increases
              </div>
            </div>
            <span className="pension-val primary" style={{ fontSize: '1.4rem' }}>
              Rs. {totalMonthlyPension.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
