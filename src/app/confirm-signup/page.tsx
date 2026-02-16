'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import AuthenticationPage from '@components/authentication/authentication';
import { AuthenticationParams } from '@components/authentication/interface/auth.interface';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
import { useConfirmSignupMutation } from '@redux/apis/auth.api';

const ConfirmSignUp = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [confirmSignup, { isLoading }] = useConfirmSignupMutation();
  const [isClient, setIsClient] = useState(false);

  const handleSignUp = async ({ email, code }: Partial<AuthenticationParams>) => {
    try {
      const formData = {
        email,
        confirmationCode: code,
      };

      await confirmSignup(formData).unwrap();
      showSuccessToast('Sign up successful!');
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
      <AuthenticationPage page={pathname} handleClick={handleSignUp} isLoading={isLoading} />
    </div>
  );
};

export default ConfirmSignUp;
