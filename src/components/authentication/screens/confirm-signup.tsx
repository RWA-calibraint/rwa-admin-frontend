import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { AuthenticationParams } from '../interface/auth.interface';

import AuthLayout from './auth.layout';

interface ConfirmSignUpPageProps {
  handleClick: (authenticationParams: Partial<AuthenticationParams>) => void;
}

const ConfirmSignUpPage: React.FC<ConfirmSignUpPageProps> = ({ handleClick }) => {
  const searchParams = useSearchParams();
  const email = String(searchParams.get('email'));
  const [code, setCode] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleClick({ email, code });
  };

  return (
    <div className="login-container">
      <h2>Confirm Signup</h2>
      <p className="subtitle">
        We have just sent a verification code to your email. Please enter the verification code
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Verification code</label>
          <input
            id="code"
            name="code"
            type="number"
            placeholder="457234"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit" className="sign-in-button">
          Confirm Signup
        </button>
      </form>
    </div>
  );
};

export default AuthLayout(ConfirmSignUpPage);
