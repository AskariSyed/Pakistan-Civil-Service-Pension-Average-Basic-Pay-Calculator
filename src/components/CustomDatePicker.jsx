import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { isScale2026 } from '../utils/calculator.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function CustomDatePicker({
  value, // "YYYY-MM-DD"
  onChange,
  hasError = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current date or default to 2026-07-05
  const parsedDate = useMemo(() => {
    if (!value) return new Date(2026, 6, 5);
    const parts = value.split('-');
    if (parts.length === 3) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
    return new Date(2026, 6, 5);
  }, [value]);

  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth()); // 0-11

  // Update view month/year when value changes from outside
  useEffect(() => {
    setViewYear(parsedDate.getFullYear());
    setViewMonth(parsedDate.getMonth());
  }, [parsedDate]);

  // Close calendar popover on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Calendar day calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);

    // Days in current month
    const numDays = lastDay.getDate();

    // Day of week for first day (convert Sunday=0 to Monday=0, Sunday=6)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    // Previous month padding days
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    const days = [];

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        dateStr: `${viewMonth === 0 ? viewYear - 1 : viewYear}-${String(viewMonth === 0 ? 12 : viewMonth).padStart(2, '0')}-${String(prevMonthLastDay - i).padStart(2, '0')}`
      });
    }

    // Current month days
    for (let d = 1; d <= numDays; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        isCurrentMonth: true,
        dateStr,
        isSelected: dateStr === value,
        isCutoff: dateStr === '2026-07-01'
      });
    }

    // Next month padding days to complete 42 or 35 grid cells
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        day: d,
        isCurrentMonth: false,
        dateStr: `${viewMonth === 11 ? viewYear + 1 : viewYear}-${String(viewMonth === 11 ? 1 : viewMonth + 2).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      });
    }

    return days;
  }, [viewYear, viewMonth, value]);

  const handleSelectDate = (dateStr) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  // Human readable format: e.g. "05 July 2026"
  const formattedDisplay = useMemo(() => {
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = MONTH_NAMES[parsedDate.getMonth()];
    const year = parsedDate.getFullYear();
    return `${day} ${month} ${year}`;
  }, [parsedDate]);

  const is2026Scale = isScale2026(parsedDate);

  // Year options for quick select dropdown
  const yearOptions = [];
  for (let y = 2022; y <= 2035; y++) {
    yearOptions.push(y);
  }

  return (
    <div ref={containerRef} className={`custom-datepicker-container ${isOpen ? 'is-open' : ''}`}>
      {/* Trigger Button */}
      <button
        type="button"
        className={`custom-datepicker-trigger ${hasError ? 'has-error' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="datepicker-trigger-content">
          <div className="datepicker-icon-badge">
            <CalendarIcon size={18} />
          </div>
          <div className="datepicker-text-group">
            <span className="datepicker-formatted-date">{formattedDisplay}</span>
            <span className="datepicker-sub">
              {is2026Scale ? 'Pay Scale 2026 Applied' : 'Pay Scale 2022 Applied'}
            </span>
          </div>
        </div>
        <ChevronDown size={16} className={`datepicker-chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="custom-datepicker-dropdown">
          {/* Calendar Header with Month/Year Navigation */}
          <div className="datepicker-header">
            <button type="button" className="datepicker-nav-btn" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>

            <div className="datepicker-selectors">
              <select
                className="datepicker-month-select"
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>

              <select
                className="datepicker-year-select"
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button type="button" className="datepicker-nav-btn" onClick={nextMonth} aria-label="Next month">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick Date Presets Bar */}
          <div className="datepicker-presets">
            <button
              type="button"
              className="datepicker-preset-btn"
              onClick={() => handleSelectDate('2026-07-05')}
            >
              05-Jul-2026 (Sample)
            </button>
            <button
              type="button"
              className="datepicker-preset-btn"
              onClick={() => handleSelectDate('2026-07-01')}
            >
              01-Jul-2026 (New Scale)
            </button>
            <button
              type="button"
              className="datepicker-preset-btn"
              onClick={() => handleSelectDate('2026-12-01')}
            >
              01-Dec-2026
            </button>
            <button
              type="button"
              className="datepicker-preset-btn"
              onClick={() => handleSelectDate('2025-06-30')}
            >
              2025 Ret.
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="datepicker-weekdays">
            {DAYS_SHORT.map((day) => (
              <span key={day} className="datepicker-weekday">{day}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="datepicker-days-grid">
            {calendarDays.map((item, index) => (
              <button
                key={index}
                type="button"
                className={`datepicker-day-cell ${
                  !item.isCurrentMonth ? 'other-month' : ''
                } ${item.isSelected ? 'selected' : ''} ${item.isCutoff ? 'cutoff-date' : ''}`}
                onClick={() => handleSelectDate(item.dateStr)}
              >
                {item.day}
              </button>
            ))}
          </div>

          {/* Bottom Info Footer */}
          <div className="datepicker-footer">
            <span className="datepicker-scale-indicator">
              {viewYear > 2026 || (viewYear === 2026 && viewMonth >= 6) ? (
                <span style={{ color: 'var(--emerald-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="dot active"></span> Revised 2026 Scale Zone (≥ 01-Jul-2026)
                </span>
              ) : (
                <span style={{ color: 'var(--indigo-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="dot indigo"></span> 2022 Scale Zone (&lt; 01-Jul-2026)
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
