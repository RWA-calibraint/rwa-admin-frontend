import { Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@components/Button/Button';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
import { validateAuthFields } from '@helpers/validations/validation';
import { useForgetPasswordMutation } from '@redux/apis/auth.api';

import { AuthenticationParams } from '../interface/auth.interface';

import AuthLayout from './auth.layout';

interface ResetPageProps {
  handleClick: (authenticationParams: Partial<AuthenticationParams>) => void;
  isLoading: boolean;
}

const ResetPasswordPage: React.FC<ResetPageProps> = ({ handleClick, isLoading }) => {
  const TIMER_KEY = 'RESEND_TIMER';
  const timerValue = localStorage.getItem(TIMER_KEY);
  const [forgetPassword] = useForgetPasswordMutation();
  const searchParams = useSearchParams();
  const email = String(searchParams.get('email'));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(timerValue ? 0 : 30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;

    setCode(newCode);
    setErrors(() => ({ ...validateAuthFields(newCode, password) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;

    setPassword(newPassword);
    setErrors(() => ({ ...validateAuthFields(code, newPassword) }));
  };

  useEffect(() => {
    if (timer > 0) {
      setIsResendDisabled(true);
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
      localStorage.setItem(TIMER_KEY, '30');
    }
  }, [timer]);

  useEffect(() => {
    const savedTimer = localStorage.getItem(TIMER_KEY);

    if (savedTimer) {
      setTimer(parseInt(savedTimer, 10));
    } else {
      setTimer(30);
    }

    return () => {
      localStorage.removeItem(TIMER_KEY);
    };
  }, []);

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const validationErrors = validateAuthFields(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }

    setErrors({});
    handleClick({ email, password, code });
  };

  const handleResendClick = async () => {
    if (isResendDisabled) return;

    setIsResendDisabled(true);
    setTimer(30);

    const formData = {
      email,
    };
    const response = await forgetPassword(formData);

    if (response.error) {
      showErrorToast(response.error);
    } else {
      showSuccessToast('Verification code has been sent to your email');
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    event.currentTarget.blur();
  };

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      <p className="subtitle">
        We have just sent a verification code to your email. Please enter the verification code and set your new
        password.
      </p>
      <form>
        <div className="form-group">
          <label>Verification code</label>
          <input
            id="code"
            name="code"
            type="number"
            placeholder="Enter code"
            value={code}
            onChange={handleCodeChange}
            onWheel={handleWheel}
          />
          <div className="verify-block">
            {timer > 0 && (
              <>
                <span className="footer-text">Time Remaining:</span>{' '}
                <span className="footer-text" style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                  {' '}
                  0:{timer < 10 ? `0${timer}` : timer}
                </span>
              </>
            )}
            <span
              className={`btn-signin ${isResendDisabled ? 'disabled' : ''}`}
              onClick={!isResendDisabled ? handleResendClick : undefined}
              style={{ cursor: isResendDisabled ? 'not-allowed' : 'pointer', opacity: isResendDisabled ? 0.5 : 1 }}
            >
              Resend Code
            </span>
          </div>
        </div>
        <div className="form-group">
          <label>New password</label>
          <div className="pass_field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter password"
              value={password}
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
        <Button onClick={handleSubmit} loading={isLoading}>
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default AuthLayout(ResetPasswordPage);
