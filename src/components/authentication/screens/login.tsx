'use client';

import { Eye, EyeOff } from 'lucide-react';
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

const LoginPage: React.FC<LoginPageProps> = ({ handleClick, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;

    setErrors({ ...errors, email: '' });
    setEmail(newEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;

    setErrors({ ...errors, password: '' });
    setPassword(newPassword);
  };

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const validationErrors = validateAuthFields(email);

    if (!password) {
      validationErrors['password'] = 'Password is required';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }
    setErrors({});
    handleClick({ email, password });
  };

  return (
    <div className="login-container">
      <h2>Welcome to RareAgora</h2>
      <p className="subtitle">Sign in to your account.</p>
      <form>
        <div className="form-group">
          <label>Email address</label>
          <input
            name="user_email"
            type="email"
            id="user_email"
            placeholder="Enter email address"
            value={email}
            className={`${errors.email ? 'error' : ''}`}
            onChange={handleEmailChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="pass_field">
            <input
              name="user_password"
              type={showPassword ? 'text' : 'password'}
              id="user_password"
              value={password}
              placeholder="Enter password"
              autoComplete="new-password"
              onChange={handlePasswordChange}
              className={`${errors.password ? 'error' : ''}`}
            />
            {password && (
              <button type="button" className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        <div className="forgot-password">
          <Link href="/forget-password" className="forgot-btn">
            Forgot password?
          </Link>
        </div>
        <Button onClick={handleSubmit} loading={isLoading}>
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default AuthLayout(LoginPage);
