import React, { useMemo } from 'react';
import { PAY_SCALES } from '../data/payScales.js';
import { getAvailableBasicPayStages, isScale2026 } from '../utils/calculator.js';
import CustomSelect from './CustomSelect.jsx';
import CustomDatePicker from './CustomDatePicker.jsx';
import { Calendar, Hash, Award, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CalculatorForm({
  bps,
  setBps,
  lastBasicPay,
  setLastBasicPay,
  personalPay,
  setPersonalPay,
  retirementDate,
  setRetirementDate,
  errors,
  onApplyPreset
}) {
  const currentBpsData = PAY_SCALES[bps] || PAY_SCALES[1];

  const retDateObj = useMemo(() => {
    return retirementDate ? new Date(retirementDate) : new Date(2026, 6, 5);
  }, [retirementDate]);

  const is2026 = useMemo(() => isScale2026(retDateObj), [retDateObj]);
  const activeScale = is2026 ? currentBpsData.scale2026 : currentBpsData.scale2022;
  const activeScaleYear = is2026 ? 2026 : 2022;

  // Stages available for the current BPS and active scale
  const stages = useMemo(() => {
    return getAvailableBasicPayStages(bps, retirementDate);
  }, [bps, retirementDate]);

  // Current stage calculation if valid
  const currentStage = useMemo(() => {
    const payNum = Number(lastBasicPay);
    if (!payNum || isNaN(payNum)) return null;
    if (payNum < activeScale.initial || payNum > activeScale.maximum) return null;
    const diff = payNum - activeScale.initial;
    if (diff % activeScale.increment !== 0) return null;
    return diff / activeScale.increment;
  }, [lastBasicPay, activeScale]);

  const isAtCeiling = currentStage === activeScale.stages;

  const handleBpsChange = (newBpsVal) => {
    const newBps = Number(newBpsVal);
    setBps(newBps);
    const newScale = is2026 ? PAY_SCALES[newBps].scale2026 : PAY_SCALES[newBps].scale2022;
    setLastBasicPay(newScale.maximum);
    setPersonalPay(0);
  };

  const bpsOptions = useMemo(() => {
    return Object.keys(PAY_SCALES).map((num) => {
      const item = PAY_SCALES[num];
      const s = is2026 ? item.scale2026 : item.scale2022;
      return {
        value: Number(num),
        label: `BPS-${num.padStart(2, '0')} (${item.bpsLabel})`,
        sublabel: `Rs. ${s.initial.toLocaleString()} – Rs. ${s.maximum.toLocaleString()} (Inc: Rs. ${s.increment.toLocaleString()})`,
        badge: `${s.stages} Stages`
      };
    });
  }, [is2026]);

  const stageOptions = useMemo(() => {
    return stages.map((s) => ({
      value: s.pay,
      label: s.label,
      badge: s.stage === 0 ? 'Initial' : s.stage === activeScale.stages ? 'Ceiling' : `+${s.stage} Inc`
    }));
  }, [stages, activeScale]);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Hash className="card-title-icon" size={20} />
          <span>Employee Information</span>
        </h2>
        <span className={`meta-badge ${is2026 ? 'highlight' : ''}`}>
          {activeScaleYear} Pay Scale Applied
        </span>
      </div>

      {/* Modern BPS Custom Dropdown */}
      <div className="form-group">
        <label className="form-label" htmlFor="bps-select">
          <span>BPS of Employee (1 to 22)</span>
          <span className="form-label-desc">Pay Scale: {activeScaleYear}</span>
        </label>
        <CustomSelect
          id="bps-select"
          icon={Award}
          options={bpsOptions}
          value={bps}
          onChange={handleBpsChange}
          placeholder="Select BPS (1 to 22)"
        />
        {errors.bps && <div className="input-error"><AlertCircle size={14} />{errors.bps}</div>}
      </div>

      {/* Modern Custom Date Picker */}
      <div className="form-group">
        <label className="form-label" htmlFor="ret-date">
          <span>Date of Retirement</span>
          <span className="form-label-desc">
            {is2026 ? '≥ 01-Jul-2026 (Scale 2026)' : '< 01-Jul-2026 (Scale 2022)'}
          </span>
        </label>
        <CustomDatePicker
          value={retirementDate}
          onChange={setRetirementDate}
          hasError={Boolean(errors.retirementDate)}
        />
        {errors.retirementDate && (
          <div className="input-error"><AlertCircle size={14} />{errors.retirementDate}</div>
        )}
        <div className="input-hint">
          Determines the 24 preceding monthly emoluments and transition between 2022 & 2026 scales.
        </div>
      </div>

      {/* Scale Info Summary Pill */}
      <div className="scale-info-pill">
        <div className="scale-info-row">
          <span className="scale-info-label">Active Scale:</span>
          <span className="scale-info-val">BPS-{bps.toString().padStart(2, '0')} ({activeScaleYear})</span>
        </div>
        <div className="scale-info-row">
          <span className="scale-info-label">Initial Basic Pay:</span>
          <span className="scale-info-val">Rs. {activeScale.initial.toLocaleString()}</span>
        </div>
        <div className="scale-info-row">
          <span className="scale-info-label">Annual Increment:</span>
          <span className="scale-info-val">Rs. {activeScale.increment.toLocaleString()} / year</span>
        </div>
        <div className="scale-info-row">
          <span className="scale-info-label">Maximum / Ceiling (Stage {activeScale.stages}):</span>
          <span className="scale-info-val">Rs. {activeScale.maximum.toLocaleString()}</span>
        </div>
      </div>

      {/* Last Basic Pay without Usual Increment */}
      <div className="form-group">
        <label className="form-label" htmlFor="basic-pay">
          <span>Last Basic Pay (Without Usual Increment)</span>
          {currentStage !== null && (
            <span style={{ color: 'var(--emerald-500)', fontWeight: 600, fontSize: '0.78rem' }}>
              Stage {currentStage} {isAtCeiling ? '(Ceiling)' : ''}
            </span>
          )}
        </label>
        <div className="input-wrapper">
          <span className="input-currency-badge">PKR</span>
          <input
            id="basic-pay"
            type="number"
            className={`form-input has-prefix ${errors.lastBasicPay ? 'has-error' : ''}`}
            placeholder={`e.g. ${activeScale.maximum}`}
            value={lastBasicPay}
            onChange={(e) => setLastBasicPay(e.target.value === '' ? '' : Number(e.target.value))}
            step={activeScale.increment}
            min={activeScale.initial}
            max={activeScale.maximum}
          />
        </div>
        {errors.lastBasicPay && (
          <div className="input-error"><AlertCircle size={14} />{errors.lastBasicPay}</div>
        )}

        {/* Sleek Stage Selector Dropdown */}
        <div style={{ marginTop: '8px' }}>
          <CustomSelect
            options={stageOptions}
            value={lastBasicPay}
            onChange={(val) => setLastBasicPay(Number(val))}
            placeholder={`Select Stage (0 to ${activeScale.stages})`}
          />
        </div>
        <div className="input-hint">
          Enter basic pay or pick from the stage dropdown above (matches increment multiple).
        </div>
      </div>

      {/* Personal Pay (PP) If any */}
      <div className="form-group">
        <label className="form-label" htmlFor="personal-pay">
          <span>Personal Pay (PP) If any</span>
          {isAtCeiling ? (
            <span style={{ color: 'var(--amber-500)', fontSize: '0.75rem', fontWeight: 600 }}>
              Admissible (At Ceiling)
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Only applicable at ceiling
            </span>
          )}
        </label>
        <div className="input-wrapper">
          <span className="input-currency-badge">PKR</span>
          <input
            id="personal-pay"
            type="number"
            className={`form-input has-prefix ${errors.personalPay ? 'has-error' : ''}`}
            placeholder="0"
            value={personalPay}
            onChange={(e) => setPersonalPay(e.target.value === '' ? 0 : Number(e.target.value))}
            step={activeScale.increment}
            min={0}
          />
        </div>
        {errors.personalPay && (
          <div className="input-error"><AlertCircle size={14} />{errors.personalPay}</div>
        )}
        <div className="input-hint">
          {isAtCeiling
            ? `Granted to employees who reach maximum stage. Must be multiple of Rs. ${activeScale.increment.toLocaleString()}.`
            : `Personal pay is 0 unless basic pay has reached the scale maximum (Rs. ${activeScale.maximum.toLocaleString()}).`}
        </div>
      </div>

      {/* Quick Presets */}
      <div className="presets-section">
        <div className="presets-title">
          <Sparkles size={14} style={{ display: 'inline', marginRight: 4 }} />
          Quick Test Presets
        </div>
        <div className="preset-chips">
          <button
            type="button"
            className="preset-chip"
            onClick={() => onApplyPreset(1, 31880, 0, '2026-07-05')}
            title="Excel Default Sample: BPS-01 with 2026 Scale ceiling"
          >
            Excel Default (BPS-01)
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => onApplyPreset(1, 31880, 1040, '2026-07-05')}
            title="BPS-01 with Personal Pay Rs. 1,040"
          >
            BPS-01 + PP
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => onApplyPreset(16, 115320, 0, '2026-07-05')}
            title="BPS-16 Superintendent Ceiling"
          >
            BPS-16 Officer
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => onApplyPreset(17, 136340, 0, '2026-07-05')}
            title="BPS-17 Gazetted Section Officer"
          >
            BPS-17 Gazetted
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => onApplyPreset(19, 214510, 0, '2026-07-05')}
            title="BPS-19 Deputy Secretary"
          >
            BPS-19 Senior
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => onApplyPreset(1, 26450, 0, '2025-06-15')}
            title="Pre-July 2026 Retirement (2022 Scale)"
          >
            2025 Ret. (Scale 2022)
          </button>
        </div>
      </div>
    </div>
  );
}
