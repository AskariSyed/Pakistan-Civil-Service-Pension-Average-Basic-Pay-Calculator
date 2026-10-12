import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header.jsx';
import CalculatorForm from './components/CalculatorForm.jsx';
import ResultsSummary from './components/ResultsSummary.jsx';
import BreakdownTable from './components/BreakdownTable.jsx';
import PensionEstimator from './components/PensionEstimator.jsx';
import PayScaleModal from './components/PayScaleModal.jsx';
import RulesExplainer from './components/RulesExplainer.jsx';
import Footer from './components/Footer.jsx';
import PrintStatement from './components/PrintStatement.jsx';
import { calculateAverageBasicPay } from './utils/calculator.js';
import { Table, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState('dark');

  // Input states - initialized with default values from the Excel sheet
  const [bps, setBps] = useState(1);
  const [lastBasicPay, setLastBasicPay] = useState(31880);
  const [personalPay, setPersonalPay] = useState(0);
  const [ppMode, setPpMode] = useState('fixed'); // 'fixed' (e.g. Rs. 2,000 / Pay Protection) | 'ceiling' (Excel stagnation rule)
  const [retirementDate, setRetirementDate] = useState('2026-07-05');

  // UI States
  const [activeTab, setActiveTab] = useState('breakdown'); // 'breakdown' | 'pension'
  const [isPayScaleModalOpen, setIsPayScaleModalOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Perform Real-Time Calculation
  const result = useMemo(() => {
    return calculateAverageBasicPay(bps, lastBasicPay, personalPay, retirementDate, ppMode);
  }, [bps, lastBasicPay, personalPay, retirementDate, ppMode]);

  const handleApplyPreset = (newBps, newPay, newPP, newDate, newPpMode = 'ceiling') => {
    setBps(newBps);
    setLastBasicPay(newPay);
    setPersonalPay(newPP);
    setRetirementDate(newDate);
    if (newPpMode) setPpMode(newPpMode);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Screen Interactive UI */}
      <div className="screen-only-content">
        {/* Top Header */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenPayScaleModal={() => setIsPayScaleModalOpen(true)}
          onPrint={handlePrint}
          onToggleRules={() => setShowRules((prev) => !prev)}
          showRules={showRules}
        />

        {/* Notice Banner from Excel Sheet Note */}
        <div className="notice-banner">
          <span className="notice-badge">Official Note</span>
          <span>
            This calculator implements the official 24-Month Average Basic Pay formula for Pakistan Civil Servants (Pay Scales 2022 & 2026). If promoted, upgraded, or given time scale during the last 24 months, manual adjustment for varying BPS may be needed.
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="main-grid">
          {/* Left Column: Form Controls */}
          <section aria-label="Input Controls">
            <CalculatorForm
              bps={bps}
              setBps={setBps}
              lastBasicPay={lastBasicPay}
              setLastBasicPay={setLastBasicPay}
              personalPay={personalPay}
              setPersonalPay={setPersonalPay}
              ppMode={ppMode}
              setPpMode={setPpMode}
              retirementDate={retirementDate}
              setRetirementDate={setRetirementDate}
              errors={result.errors || {}}
              onApplyPreset={handleApplyPreset}
            />
          </section>

          {/* Right Column: Results & Breakdown */}
          <section aria-label="Calculation Results">
            {/* Hero Result & Stat Cards */}
            <ResultsSummary result={result} />

            {/* Validation Error Alert if any */}
            {!result.isValid && result.errors && (
              <div
                className="card"
                style={{
                  background: 'rgba(244, 63, 94, 0.08)',
                  borderColor: 'var(--rose-500)',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <AlertTriangle size={24} color="#f43f5e" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#f43f5e' }}>Invalid Input Parameters:</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {Object.values(result.errors).join(' ')}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Tabs between 24-Month Table and Full Pension Estimate */}
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'breakdown' ? 'active' : ''}`}
                onClick={() => setActiveTab('breakdown')}
              >
                <Table size={16} />
                <span>24-Month Detailed Table</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'pension' ? 'active' : ''}`}
                onClick={() => setActiveTab('pension')}
              >
                <ShieldCheck size={16} />
                <span>Full Pension & Commutation Estimator</span>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'breakdown' ? (
              <BreakdownTable
                months={result.months}
                totalBasic={result.totalBasic}
                totalPP={result.totalPP}
                totalSum={result.totalSum}
                avgBasic={result.avgBasic}
                avgPP={result.avgPP}
                avgTotal={result.avgTotal}
                avgRound={result.avgRound}
              />
            ) : (
              <PensionEstimator
                avgBasicPay={result.avgRound}
                bps={bps}
              />
            )}

            {/* Explanatory Rules Section (collapsible / toggleable) */}
            {showRules && <RulesExplainer />}
          </section>
        </div>

        {/* Footer with personal use disclaimer */}
        <Footer />
      </div>

      {/* Print Statement Document (visible only when printing or generating PDF) */}
      <PrintStatement
        result={result}
        bps={bps}
        lastBasicPay={lastBasicPay}
        personalPay={personalPay}
        retirementDate={retirementDate}
      />

      {/* Pay Scale Reference Modal */}
      <PayScaleModal
        isOpen={isPayScaleModalOpen}
        onClose={() => setIsPayScaleModalOpen(false)}
      />

      {/* Vercel Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
