'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '../components/Button/Button';

import '../components/error-page/styles.scss';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="errorContainer">
      <Image src="/404.svg" alt="404" width={232} height={154} />
      <div className="errorContent">
        <p className="errorTitle">Page Not Found</p>
        <p className="errorMessage">{`We're not sure what went wrong. Go back or click the button below to go home.`}</p>
      </div>
      <Button className="homeButton" onClick={() => router.replace('/dashboard')}>
        Take me home
      </Button>
    </div>
  );
}
