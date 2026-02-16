'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import AuthenticationPage from '@components/authentication/authentication';
import { AuthenticationParams } from '@components/authentication/interface/auth.interface';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
import { useResetPasswordMutation } from '@redux/apis/auth.api';

const ResetPassword = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [isClient, setIsClient] = useState(false);

  const handleReset = async ({ email, password, code: confirmationCode }: Partial<AuthenticationParams>) => {
    try {
      const formData = {
        email,
        password,
        confirmationCode,
      };

      await resetPassword(formData).unwrap();
      showSuccessToast('Password reset successfull');
      router.replace('/login');
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
      <AuthenticationPage page={pathname} handleClick={handleReset} isLoading={isLoading} />
    </div>
  );
};

export default ResetPassword;
