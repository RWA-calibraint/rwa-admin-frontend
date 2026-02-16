import Link from 'next/link';
import { useState } from 'react';

import Button from '@components/Button/Button';
import { validateAuthFields } from '@helpers/validations/validation';

import { AuthenticationParams } from '../interface/auth.interface';

import AuthLayout from './auth.layout';

interface LoginPageProps {
  handleClick: (authenticationParams: Partial<AuthenticationParams>) => void;
  isLoading: boolean;
}
const ForgetPasswordPage: React.FC<LoginPageProps> = ({ handleClick, isLoading }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const validationErrors = validateAuthFields(email);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }
    setErrors({});
    handleClick({ email });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;

    setEmail(newEmail);
    setErrors({});
  };

  return (
    <div className="login-container">
      <h2>Forgot password</h2>
      <p className="subtitle">Don’t worry, you can regain access in just a few steps.</p>
      <form>
        <div className="form-group">
          <label>Email address</label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Enter email address"
            value={email}
            onChange={handleEmailChange}
            className={`${errors.email ? 'error' : ''}`}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <Button onClick={handleSubmit} loading={isLoading}>
          Continue
        </Button>
        <div style={{ textAlign: 'center' }}>
          <span className="footer-text">Remember your password? </span>
          <Link href="/login" className="btn-signin">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AuthLayout(ForgetPasswordPage);
