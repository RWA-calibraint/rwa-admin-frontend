'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import AuthenticationPage from '@components/authentication/authentication';
import { AuthenticationParams } from '@components/authentication/interface/auth.interface';
import { showErrorToast } from '@helpers/constants/toast.notification';
import { useForgetPasswordMutation } from '@redux/apis/auth.api';

const ForgetPassword = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [isClient, setIsClient] = useState(false);

  const handleSign = async ({ email }: Partial<AuthenticationParams>) => {
    try {
      const formData = {
        email,
      };

      await forgetPassword(formData).unwrap();
      router.push(`/reset-password?email=${encodeURIComponent(String(email))}`);
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
      <AuthenticationPage page={pathname} handleClick={handleSign} isLoading={isLoading} />
    </div>
  );
};

export default ForgetPassword;
