import React, { useState, useEffect } from 'react';
import './Login.css';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../context/AuthContext';
import { useRouter, Link } from '../context/RouterContext';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, HelpCircle, X } from 'lucide-react';

function Login() {
  const { login, getRememberedEmail } = useAuth();
  const { navigate } = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation & feedback
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Forgot password modal/banner state
  const [showForgotPasswordNotice, setShowForgotPasswordNotice] = useState(false);

  // Prepopulate remembered email on mount
  useEffect(() => {
    const savedEmail = getRememberedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [getRememberedEmail]);

  const isValidEmail = (val) => {
    const re = /^[a-zA-Z0-9._%+-]+@mmmut\.ac\.in$/i;
    return re.test(String(val).trim());
  };

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'College email address is required.';
    } else if (!isValidEmail(email)) {
      errs.email = 'Please enter a valid MMMUT email address (e.g., rollnumber@mmmut.ac.in).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate();
    setErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoginError('Please enter your college email and password to log in.');
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    try {
      await login({
        email,
        password,
        rememberMe,
      });

      setLoginSuccess(true);
      // Brief delay before redirecting to homepage so the user sees the success state
      setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (err) {
      setLoginError(err.message || 'Invalid college email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to connect with campus communities and peers"
      badge="Student Portal"
    >
      {/* Success state */}
      {loginSuccess ? (
        <div className="login-success-state" role="status">
          <div className="success-icon-banner">
            <CheckCircle2 size={36} className="success-icon" />
          </div>
          <h3 className="success-title">Login Successful!</h3>
          <p className="success-message">
            Welcome back! Redirecting you to the MalviyaSphere homepage...
          </p>
          <div className="loading-bar-wrapper">
            <div className="loading-bar-indicator" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="auth-form-root">
          {/* General Login Error */}
          {loginError && (
            <div className="auth-general-alert alert-error" role="alert">
              <AlertCircle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          {/* College Email Field */}
          <div className={`form-field-group ${errors.email && touched.email ? 'has-error' : ''}`}>
            <label htmlFor="login-email" className="input-label">
              College Email Address <span className="required-star" aria-hidden="true">*</span>
            </label>
            <div className="input-field-wrapper">
              <span className="input-prefix-icon" aria-hidden="true">
                <Mail size={17} />
              </span>
              <input
                type="email"
                id="login-email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  if (loginError) setLoginError(null);
                }}
                onBlur={() => handleBlur('email')}
                placeholder="rollnumber@mmmut.ac.in (e.g. 2024011001@mmmut.ac.in)"
                required
                disabled={isSubmitting}
                className="native-input"
                aria-invalid={!!errors.email && touched.email}
                aria-describedby={errors.email && touched.email ? 'login-email-error' : undefined}
                autoComplete="email"
              />
            </div>
            {errors.email && touched.email && (
              <p id="login-email-error" className="input-error-msg" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <PasswordInput
            id="login-password"
            name="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              if (loginError) setLoginError(null);
            }}
            onBlur={() => handleBlur('password')}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            disabled={isSubmitting}
            error={touched.password ? errors.password : undefined}
          />

          {/* Preferences Row: Remember Me & Forgot Password */}
          <div className="login-options-row">
            <label className="checkbox-label" htmlFor="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
                className="native-checkbox"
              />
              <span className="checkbox-text">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotPasswordNotice(true)}
              className="forgot-password-link"
            >
              Forgot password?
            </button>
          </div>

          {/* Forgot Password Placeholder Notice */}
          {showForgotPasswordNotice && (
            <div className="forgot-password-callout" role="region" aria-label="Password recovery notice">
              <div className="callout-header">
                <div className="callout-title">
                  <HelpCircle size={15} />
                  <span>Password Recovery Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordNotice(false)}
                  className="callout-close-btn"
                  aria-label="Close recovery notice"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="callout-text">
                Password recovery is not connected to a backend yet. For testing, you can log in with your
                MMMUT email format (e.g. <code>rollnumber@mmmut.ac.in</code>) and any password with 8+ characters.
              </p>
            </div>
          )}

          {/* Submit Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary auth-submit-btn"
          >
            <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
            {!isSubmitting && <ArrowRight size={17} />}
          </button>

          {/* Simulation Helper Tip */}
          <p className="mock-credentials-tip">
            <strong>Mock testing tip:</strong> Any valid <code>rollnumber@mmmut.ac.in</code> works. Include <code>fail</code> in the email or password <code>wrongpassword</code> to test error handling.
          </p>

          {/* Navigation Links */}
          <div className="auth-footer-links">
            <p className="auth-redirect-text">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-inline-link">
                Sign Up
              </Link>
            </p>
            <Link to="/" className="auth-return-link">
              ← Return to homepage
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

export default Login;
