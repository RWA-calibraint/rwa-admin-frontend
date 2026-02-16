import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css'; // Ant Design styles should be imported early

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import type { Metadata } from 'next';

import NotificationProvider from '@/components/notifications/notification-provider';
import ClientLayout from '@components/layout/client-layout';
import StoreProvider from '@redux/store-provider';

import '@styles/global.scss'; // Global styles should come after component imports

export const metadata: Metadata = {
  title: 'RareAgora',
  description: 'Real World Asset',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: 'Inter, sans-serif',
              },
            }}
          >
            <App>
              <NotificationProvider />
              <StoreProvider>
                <ClientLayout>{children}</ClientLayout>
              </StoreProvider>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
