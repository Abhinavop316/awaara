import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  icon: Icon = null,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to object format: { value, label, badge, color, icon }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value)) || null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optVal) => {
    if (disabled) return;
    onChange(optVal);
    setIsOpen(false);
  };

  return (
    <div
      className={`custom-select-container ${disabled ? 'is-disabled' : ''} ${className}`}
      ref={containerRef}
    >
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="custom-select-left">
          {Icon && <Icon size={15} className="custom-select-icon" />}
          {selectedOption?.color && (
            <span
              className="select-color-dot"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className={`custom-select-value ${!selectedOption ? 'is-placeholder' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="select-badge-tag">{selectedOption.badge}</span>
          )}
        </div>

        <ChevronDown
          size={16}
          className={`custom-select-chevron ${isOpen ? 'is-rotated' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="custom-select-menu">
          <div className="custom-select-options-list">
            {normalizedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              const OptIcon = opt.icon;

              return (
                <div
                  key={opt.value}
                  className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <div className="option-content-left">
                    {OptIcon && <OptIcon size={14} className="option-icon" />}
                    {opt.color && (
                      <span
                        className="select-color-dot"
                        style={{ backgroundColor: opt.color }}
                      />
                    )}
                    <span className="option-label">{opt.label}</span>
                    {opt.badge && (
                      <span className="select-badge-tag">{opt.badge}</span>
                    )}
                  </div>

                  {isSelected && (
                    <Check size={14} className="option-check-icon" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
