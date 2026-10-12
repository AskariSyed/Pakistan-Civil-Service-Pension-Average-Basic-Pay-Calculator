import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  icon: Icon,
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      id={id}
    >
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
      >
        <div className="select-left-content">
          {Icon && <Icon className="select-icon" size={18} />}
          <span className="select-selected-label">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="select-badge">{selectedOption.badge}</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`select-chevron ${isOpen ? 'rotate' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          <ul className="select-options-list">
            {options.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <li
                  key={option.value}
                  className={`select-option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="option-text-group">
                    <span className="option-label">{option.label}</span>
                    {option.sublabel && (
                      <span className="option-sublabel">{option.sublabel}</span>
                    )}
                  </div>
                  <div className="option-right-group">
                    {option.badge && <span className="option-badge">{option.badge}</span>}
                    {isSelected && <Check size={16} className="option-check" />}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
