'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import AuthenticationPage from '@components/authentication/authentication';
import { AuthenticationParams } from '@components/authentication/interface/auth.interface';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
import { useSignupMutation } from '@redux/apis/auth.api';

const SignUp = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [Signup, { isLoading }] = useSignupMutation();
  const [isClient, setIsClient] = useState(false);

  const handleSign = async ({ email, password }: Partial<AuthenticationParams>) => {
    try {
      const formData = {
        email,
        password,
      };

      await Signup(formData).unwrap();
      showSuccessToast('Verification code has been sent to your email! Confirm sign up');
      router.push(`/confirm-signup?email=${encodeURIComponent(String(email))}`);
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

export default SignUp;
