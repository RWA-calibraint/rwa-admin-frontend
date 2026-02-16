'use client';

import { Button, Input, Tabs, TabsProps, Form } from 'antd';
import { ChevronLeft, Copy } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import './userDetail.scss';
import { showErrorToast, showSuccessToast } from '@/helpers/constants/toast.notification';
import { useGetUserQuery, useSendUserFeedbackMutation } from '@/redux/apis/user-management.api';
import { UserInterface } from '@/redux/interfaces/user-management.interface';

const DetailsComponent = ({ user }: { user: UserInterface }) => {
  const [feedback, setFeedback] = useState(user?.description);
  const [sendUserFeedback, { isLoading }] = useSendUserFeedbackMutation({});

  useEffect(() => {
    setFeedback(user?.description);
  }, [user]);

  const copyHandler = async () => {
    try {
      await navigator.clipboard.writeText(user?.walletAddress || 'no wallet address');
      showSuccessToast('Wallet address copied to clipboard.');
    } catch (e) {
      return e;
    }
  };

  const sendFeedbackHandler = async () => {
    try {
      await sendUserFeedback({ userId: user.userId, feedback }).unwrap();
      showSuccessToast('Feedback updated successfully');
    } catch (error) {
      showErrorToast((error as Error).message);
    }
  };

  return (
    <section>
      <section className="border-primary-1 p-24 radius-6">
        <h2 className="f-18-20-600-primary m-b-28">Basic Details</h2>
        <div className="grid-container">
          <div>
            <p className="f-12-24-400-tertiary m-b-4">USER NAME</p>
            <p className="f-14-16-600-secondary">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">USER ID</p>
            <p className="f-14-16-600-secondary">{user?.userId || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">EMAIL ADDRESS</p>
            <p className="f-14-16-600-secondary">{user?.email || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">PHONE NUMBER</p>
            <p className="f-14-16-600-secondary">{user?.phoneNumber || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">STATUS</p>
            <p className="f-14-16-600-secondary">{user?.status || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">WALLET ADDRESS</p>
            <p className="f-14-16-600-secondary">
              {user?.walletAddress && user.walletAddress ? user?.walletAddress.slice(0, 20) + '...' : '-'}
              {user?.walletAddress && <Copy className="cursor-pointer" onClick={copyHandler} size={16} />}
            </p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">REGISTERED DATE</p>
            <p className="f-14-16-600-secondary">{new Date(user?.createdAt).toLocaleDateString('en-GB') || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">TRANSACTIONS</p>
            <p className="f-14-16-600-secondary">{user?.transactions || '-'}</p>
          </div>
        </div>
      </section>

      <section className="border-primary-1 p-24 radius-6 m-t-24">
        <h2 className="f-18-20-600-primary m-b-28">User Address</h2>
        <div className="grid-container">
          <div>
            <p className="f-12-24-400-tertiary m-b-4">ADDRESS LINE</p>
            <p className="f-14-16-600-secondary">{user?.address || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">COUNTRY</p>
            <p className="f-14-16-600-secondary">{user?.country || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">APT./SUITE/BUILDING</p>
            <p className="f-14-16-600-secondary">{user?.building || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">TOWN / CITY</p>
            <p className="f-14-16-600-secondary">{user?.city || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">STATE / PROVINCE / REGION</p>
            <p className="f-14-16-600-secondary">{user?.state || '-'}</p>
          </div>
          <div>
            <p className="f-12-24-400-tertiary m-b-4">POSTAL CODE</p>
            <p className="f-14-16-600-secondary">{user?.postalCode || '-'}</p>
          </div>
        </div>
      </section>

      <Form onFinish={sendFeedbackHandler}>
        <Input.TextArea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Here you can provide information about the user..."
          autoSize={{ minRows: 4, maxRows: 8 }}
          className="border-primary-1 p-24 radius-6 m-t-24"
        />
        <Button htmlType="submit" className="m-t-24 save-feedback-btn" loading={isLoading} disabled={isLoading}>
          Save Feedback
        </Button>
      </Form>
    </section>
  );
};

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: user } = useGetUserQuery(params.userId, { refetchOnMountOrArgChange: true });

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Details',
      children: <DetailsComponent user={user} />,
    },
  ];

  return (
    <section className="p-20 user-detail-container">
      <Button type="text" className="back-btn m-b-20" onClick={() => router.push('/user-management')}>
        <ChevronLeft size={16} /> Back
      </Button>
      <section className="d-flex align-center m-b-32">
        <div className="m-r-16">
          <Image src="/profile.png" className="profile-image" alt="Profile Picture" width={80} height={80} />
        </div>
        <div>
          <h3 className="f-24-30-600-primary m-b-6">
            {user?.firstName} {user?.lastName}
          </h3>
          <h4 className="f-14-16-400-tertiary">{user?.email}</h4>
        </div>
      </section>
      <Tabs defaultActiveKey="1" items={items} />
    </section>
  );
}
