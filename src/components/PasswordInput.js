import React, { useState } from 'react';
import './PasswordInput.css';
import { Eye, EyeOff, Lock } from 'lucide-react';

function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = '••••••••',
  error,
  required = false,
  autoComplete = 'current-password',
  disabled = false,
  showRequirementsHint = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`password-input-group ${error ? 'has-error' : ''}`}>
      {label && (
        <div className="password-label-row">
          <label htmlFor={id} className="input-label">
            {label} {required && <span className="required-star" aria-hidden="true">*</span>}
          </label>
        </div>
      )}

      <div className="password-field-wrapper">
        <span className="input-prefix-icon" aria-hidden="true">
          <Lock size={17} />
        </span>
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className="password-native-input"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="password-toggle-btn"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
          disabled={disabled}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showRequirementsHint && (
        <p className="password-hint">
          Must be at least 8 characters long.
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="input-error-msg" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;
