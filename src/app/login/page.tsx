'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import AuthenticationPage from '@components/authentication/authentication';
import { AuthenticationParams } from '@components/authentication/interface/auth.interface';
import { showErrorToast } from '@helpers/constants/toast.notification';
import { useSigninMutation } from '@redux/apis/auth.api';

const Login = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [signin, { isLoading }] = useSigninMutation();
  const [isClient, setIsClient] = useState(false);
  const handleLogin = async ({ email, password }: Partial<AuthenticationParams>) => {
    try {
      const formData = {
        email,
        password,
      };

      await signin(formData).unwrap();
      router.replace('/dashboard');
    } catch (error: unknown) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <AuthenticationPage page={pathname} handleClick={handleLogin} isLoading={isLoading} />
    </div>
  );
};

export default Login;
