import Image from 'next/image';
import React from 'react';

import '../styles.scss';

const AuthLayout = <P extends object>(AuthComponent: React.FC<P>) => {
  return function AuthWrapper(props: P) {
    return (
      <div className="container">
        <div className="left-panel">
          {/* <Image src={'/login_header.png'} alt="Rare Agora Logo" className="auth-logo" preview={false} /> */}
          <Image
            src="/rareagora-logo.svg"
            alt="rareagora logo"
            width={160}
            height={70}
            className="auth-logo"
            unoptimized
          />{' '}
          <div className="panel-content">
            <h1 className="text-center">Revolutionizing Asset Ownership</h1>
            <Image
              src={'/login_banner.svg'}
              alt="Blockchain Illustration"
              width={400}
              height={100}
              className="illustration"
            />
            <div className="copyright">© 2025 RareAgora. All rights reserved.</div>
          </div>
        </div>
        <div className="right-panel">
          <AuthComponent {...props} />
        </div>
      </div>
    );
  };
};

export default AuthLayout;
