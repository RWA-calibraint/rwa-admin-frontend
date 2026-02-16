import Link from 'next/link';
import { useState } from 'react';

import { AuthenticationParams } from '../interface/auth.interface';

import AuthLayout from './auth.layout';

interface SignupPageProps {
  handleClick: (authenticationParams: Partial<AuthenticationParams>) => void;
}

const SignUpPage: React.FC<SignupPageProps> = ({ handleClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleClick({ email, password });
  };

  return (
    <div className="login-container">
      <h2>Welcome to RareAgora</h2>
      <p className="subtitle">Sign up to your account.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email address</label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="sign-in-button">
          Sign Up
        </button>
        <div style={{ textAlign: 'center' }}>
          <span className="footer-text">Already have an account? </span>
          <Link href="/login" className="btn-signin">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AuthLayout(SignUpPage);
