import { AuthenticationParams } from './interface/auth.interface';
import ForgetPasswordPage from './screens/forget-password';
import LoginPage from './screens/login';
import ResetPasswordPage from './screens/reset-password';

interface AuthenticationPageProps {
  page: string;
  isLoading: boolean;
  handleClick: (authenticationParams: Partial<AuthenticationParams>) => void;
}

const renderAuthComponent = (
  value: string,
  handleClick: (authenticationParams: Partial<AuthenticationParams>) => void,
  isLoading: boolean,
) => {
  switch (value) {
    case '/login':
      return <LoginPage handleClick={handleClick} isLoading={isLoading} />;
    case '/forget-password':
      return <ForgetPasswordPage handleClick={handleClick} isLoading={isLoading} />;
    case '/reset-password':
      return <ResetPasswordPage handleClick={handleClick} isLoading={isLoading} />;
    default:
      return <LoginPage handleClick={handleClick} isLoading={isLoading} />;
  }
};

const AuthenticationPage: React.FC<AuthenticationPageProps> = ({ page, handleClick, isLoading }) => {
  return renderAuthComponent(page, handleClick, isLoading);
};

export default AuthenticationPage;
