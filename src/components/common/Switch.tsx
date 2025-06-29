import React from 'react';

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ label, checked, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="switch-control">
      <label className="switch-label">
        <span className="switch-text">{label}</span>
        <div className="switch-wrapper">
          <input
            type="checkbox"
            className="switch-input"
            checked={checked}
            onChange={handleChange}
          />
          <span className="switch-slider"></span>
        </div>
      </label>
    </div>
  );
};