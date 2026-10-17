import React, { useState } from 'react';
import './Signup.css';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import EmailVerificationStatus from '../components/EmailVerificationStatus';
import { useAuth } from '../context/AuthContext';
import { useRouter, Link } from '../context/RouterContext';
import { User, Mail, School, ArrowRight, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

function Signup() {
  const { signup } = useAuth();
  const { navigate } = useRouter();

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: 'Madan Mohan Malaviya University of Technology, Gorakhpur',
    password: '',
    confirmPassword: '',
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Email format validator: rollnumber@mmmut.ac.in
  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@mmmut\.ac\.in$/i;
    return re.test(String(email).trim());
  };

  // Field validation logic
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required.';
        } else if (value.trim().length < 2) {
          error = 'Please enter your full name.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'College email address is required.';
        } else if (!isValidEmail(value)) {
          error = 'Please enter a valid email address (e.g., rollnumber@mmmut.ac.in).';
        }
        break;
      case 'college':
        if (!value.trim()) {
          error = 'College or university name is required.';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required.';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long.';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password.';
        } else if (value !== formData.password) {
          error = 'Passwords do not match.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear or update field error dynamically if touched
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }

    // Special case: if password changes, check confirmPassword if touched
    if (name === 'password' && touched.confirmPassword) {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }

    if (generalError) setGeneralError(null);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = {
      name: true,
      email: true,
      college: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setGeneralError('Please resolve the highlighted errors before continuing.');
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college,
      });

      navigate('/onboarding');
    } catch (err) {
      setGeneralError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join your peers and discover campus interests"
      badge="Join MalviyaSphere"
    >
      {/* Success Banner if account was just created */}
      {signupSuccess ? (
        <div className="signup-success-state" role="status">
          <div className="success-icon-banner">
            <CheckCircle2 size={36} className="success-icon" />
          </div>
          <h3 className="success-title">Account Created Successfully!</h3>
          <p className="success-message">
            Welcome to MalviyaSphere, <strong>{formData.name}</strong>. A simulated verification notification
            has been queued for your college email: <strong>{formData.email}</strong>.
          </p>

          <EmailVerificationStatus email={formData.email} />

          <div className="success-actions-row">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-primary auth-submit-btn"
            >
              <span>Explore Campus Communities</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setSignupSuccess(false);
                setFormData({
                  name: '',
                  email: '',
                  college: 'Madan Mohan Malaviya University of Technology, Gorakhpur',
                  password: '',
                  confirmPassword: '',
                });
                setTouched({});
                setErrors({});
              }}
              className="btn-secondary auth-secondary-btn"
            >
              Register Another Account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="auth-form-root">
          {/* General Error Banner */}
          {generalError && (
            <div className="auth-general-alert alert-error" role="alert">
              <AlertCircle size={18} />
              <span>{generalError}</span>
            </div>
          )}

          {/* Full Name */}
          <div className={`form-field-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="signup-name" className="input-label">
              Full Name <span className="required-star" aria-hidden="true">*</span>
            </label>
            <div className="input-field-wrapper">
              <span className="input-prefix-icon" aria-hidden="true">
                <User size={17} />
              </span>
              <input
                type="text"
                id="signup-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Aditi Sharma"
                required
                disabled={isSubmitting}
                className="native-input"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'signup-name-error' : undefined}
              />
            </div>
            {errors.name && (
              <p id="signup-name-error" className="input-error-msg" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* College Email Address */}
          <div className={`form-field-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="signup-email" className="input-label">
              College Email Address <span className="required-star" aria-hidden="true">*</span>
            </label>
            <div className="input-field-wrapper">
              <span className="input-prefix-icon" aria-hidden="true">
                <Mail size={17} />
              </span>
              <input
                type="email"
                id="signup-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="rollnumber@mmmut.ac.in (e.g. 2024011001@mmmut.ac.in)"
                required
                disabled={isSubmitting}
                className="native-input"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'signup-email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="signup-email-error" className="input-error-msg" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* College / University Name */}
          <div className={`form-field-group ${errors.college ? 'has-error' : ''}`}>
            <label htmlFor="signup-college" className="input-label">
              College or University <span className="required-star" aria-hidden="true">*</span>
            </label>
            <div className="input-field-wrapper">
              <span className="input-prefix-icon" aria-hidden="true">
                <School size={17} />
              </span>
              <select
                id="signup-college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                disabled={isSubmitting}
                className="native-input"
                aria-invalid={!!errors.college}
                aria-describedby={errors.college ? 'signup-college-error' : undefined}
                style={{ cursor: 'pointer', background: 'transparent' }}
              >
                <option value="Madan Mohan Malaviya University of Technology, Gorakhpur">
                  Madan Mohan Malaviya University of Technology, Gorakhpur
                </option>
              </select>
            </div>
            {errors.college && (
              <p id="signup-college-error" className="input-error-msg" role="alert">
                {errors.college}
              </p>
            )}
          </div>

          {/* Password */}
          <PasswordInput
            id="signup-password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="At least 8 characters"
            required
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.password}
            showRequirementsHint
          />

          {/* Confirm Password */}
          <PasswordInput
            id="signup-confirm-password"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Re-enter your password"
            required
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.confirmPassword}
          />

          {/* Live Simulated Email Verification Indicator Component */}
          <div className="signup-verification-section">
            <span className="section-sub-label">Email Verification Preview:</span>
            <EmailVerificationStatus email={formData.email} compact />
          </div>

          {/* Privacy & College Email Usage Note */}
          <div className="college-privacy-notice">
            <Shield size={16} className="notice-icon" />
            <p>
              <strong>College verification notice:</strong> We use your college email to verify campus membership
              and connect you with peers. Your email is kept private and never shared. (Simulated verification)
            </p>
          </div>

          {/* Primary Create Account Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary auth-submit-btn"
          >
            <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
            {!isSubmitting && <ArrowRight size={17} />}
          </button>

          {/* Navigation Links */}
          <div className="auth-footer-links">
            <p className="auth-redirect-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-inline-link">
                Log In
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

export default Signup;
