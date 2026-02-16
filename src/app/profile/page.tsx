'use client';

import { Form, Input, Modal, Skeleton } from 'antd';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import Button from '@/components/Button/Button';
import { useGetAdminProfileQuery, useUpdateAdminProfileMutation } from '@/redux/apis/admin.api';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';

import './profile.scss';

export default function Profile() {
  const router = useRouter();
  const [adminProfile, setAdminProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [isNameFieldsUpdate, setIsNameFieldsUpdate] = useState(false);
  const [newEmailInfo, setNewEmailInfo] = useState({
    newEmail: '',
    password: '',
  });
  const [newPasswordInfo, setNewPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { data: adminProfileResponse, isLoading, refetch } = useGetAdminProfileQuery({});
  const [updateAdminProfile] = useUpdateAdminProfileMutation();

  useEffect(() => {
    if (adminProfileResponse?.response) {
      setAdminProfile(adminProfileResponse?.response);
    }
    refetch();
  }, [adminProfileResponse]);

  const updateAdminNameHandler = async () => {
    try {
      if (isNameFieldsUpdate) {
        await updateAdminProfile({ adminProfile, updateType: 'update_name' }).unwrap();
        showSuccessToast('Profile name updated successfully');
        setIsNameFieldsUpdate(false);
      }
    } catch (error) {
      showErrorToast(JSON.stringify(error));
    }
  };

  const updateAdminEmailHandler = async () => {
    try {
      if (newEmailInfo.newEmail === adminProfile.email) {
        showErrorToast('Email should not be same as current email');
      } else if (newEmailInfo.newEmail && newEmailInfo.password) {
        await updateAdminProfile({ adminProfile: newEmailInfo, updateType: 'update_email' }).unwrap();
        showSuccessToast('Email updated successfully');
        setOpenEmailModal(false);
        setNewEmailInfo({
          newEmail: '',
          password: '',
        });
        Cookies.remove('token', { path: '/' });
        router.replace('/login');
        window.location.reload();
      }
    } catch (error) {
      showErrorToast(JSON.stringify(error));
    }
  };

  const updateAdminPasswordHandler = async () => {
    try {
      if (newPasswordInfo.newPassword && newPasswordInfo.confirmPassword) {
        const result = await updateAdminProfile({
          adminProfile: newPasswordInfo,
          updateType: 'update_password',
        }).unwrap();

        if (result?.error) {
          showErrorToast(JSON.stringify(result?.error));

          return;
        }
        showSuccessToast('Password updated successfully');
        setOpenPasswordModal(false);
        setNewPasswordInfo({
          newPassword: '',
          confirmPassword: '',
          currentPassword: '',
        });
        Cookies.remove('token', { path: '/' });
        router.replace('/login');
        window.location.reload();
      }
    } catch (error) {
      showErrorToast(JSON.stringify(error));
    }
  };

  return (
    <>
      {isLoading ? (
        <Skeleton className="p-24" />
      ) : (
        <section className="p-20 profile-container">
          <section className="d-flex align-center">
            <div className="m-r-16">
              <Image src="/profile.png" className="profile-image" alt="Profile Picture" width={80} height={80} />
            </div>
            <div>
              <h3 className="f-24-30-600-primary m-b-6">
                {adminProfile?.firstName} {adminProfile?.lastName}
              </h3>
              <h4 className="f-14-16-400-tertiary">{adminProfile?.email}</h4>
            </div>
          </section>
          <section className="w-500 m-t-40">
            <Form className="profile-form-container" onFinish={updateAdminNameHandler}>
              <section className="d-flex align-center gap-4">
                <div>
                  <label>
                    First Name <span className="asterisk">*</span>
                  </label>
                  <Input
                    value={adminProfile?.firstName}
                    className="p-x-12 p-y-8"
                    onChange={(e) => {
                      setAdminProfile((prev) => ({ ...prev, firstName: e.target.value }));
                      setIsNameFieldsUpdate(true);
                    }}
                    required
                  />
                </div>
                <div>
                  <label>
                    Last Name <span className="asterisk">*</span>
                  </label>
                  <Input
                    value={adminProfile?.lastName}
                    className="p-x-12 p-y-8"
                    onChange={(e) => {
                      setAdminProfile((prev) => ({ ...prev, lastName: e.target.value }));
                      setIsNameFieldsUpdate(true);
                    }}
                    required
                  />
                </div>
              </section>
              <div className="m-t-16">
                <label>
                  Email address <span className="asterisk">*</span>
                </label>
                <Input value={adminProfile?.email} className="p-x-12 p-y-8 bg-secondary" disabled />
                <button className="profile-change-button" onClick={() => setOpenEmailModal(true)}>
                  Change
                </button>
              </div>
              <div className="m-t-16">
                <label>
                  Password <span className="asterisk">*</span>
                </label>
                <Input.Password value={adminProfile?.password} className="form-input" placeholder="••••••••" disabled />
                <button className="profile-change-button" onClick={() => setOpenPasswordModal(true)}>
                  Change
                </button>
              </div>

              <Button type="submit" className="m-t-40 profile-save-button">
                Save
              </Button>
            </Form>
          </section>
        </section>
      )}
      <Modal open={openEmailModal} closable={false} footer={false} className="change-modal-container">
        <section className="p-24">
          <h2 className="f-18-20-600-primary m-b-10">Change Email Address</h2>
          <p className="f-14-20-400-tertiary">
            Once you{"'"}ve updated your email, all future communication and notifications will be sent to your new
            address.
          </p>
          <div className="m-t-24">
            <label className="f-14-20-400-tertiary">Current Email address</label>
            <h4 className="f-16-20-500-primary">{adminProfile?.email}</h4>
          </div>
          <div className="profile-modal-divider"></div>
          <Form onFinish={updateAdminEmailHandler}>
            <div>
              <label>New Email Address</label>
              <Input
                className="p-x-12 p-y-8"
                placeholder="Enter email address"
                onChange={(e) => {
                  setNewEmailInfo((prev) => ({ ...prev, newEmail: e.target.value }));
                }}
                required
              />
            </div>
            <div className="m-t-16">
              <label>Password</label>
              <Input.Password
                className="p-x-12 p-y-8"
                placeholder="Enter Password"
                onChange={(e) => {
                  setNewEmailInfo((prev) => ({ ...prev, password: e.target.value }));
                }}
                required
              />
            </div>
            <div className="d-flex align-center justify-flex-end change-modal-footer gap-3 m-t-24">
              <Button type="button" onClick={() => setOpenEmailModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Change email address</Button>
            </div>
          </Form>
        </section>
      </Modal>
      <Modal open={openPasswordModal} closable={false} footer={false} className="change-modal-container">
        <section className="p-24">
          <h2 className="f-18-20-600-primary m-b-10">Change Password</h2>
          <p className="f-14-20-400-tertiary">Set a new password to keep your account secure.</p>
          <Form className="m-t-24" onFinish={updateAdminPasswordHandler}>
            <div>
              <label>Current Password</label>
              <Input.Password
                className="p-x-12 p-y-8"
                placeholder="Enter current password"
                onChange={(e) => {
                  setNewPasswordInfo((prev) => ({ ...prev, currentPassword: e.target.value }));
                }}
              />
            </div>
            <div className="m-t-16">
              <label>New Password</label>
              <Input.Password
                className="p-x-12 p-y-8"
                placeholder="Enter new password"
                onChange={(e) => {
                  setNewPasswordInfo((prev) => ({ ...prev, newPassword: e.target.value }));
                }}
              />
            </div>
            <div className="m-t-16">
              <label>Confirm Password</label>
              <Input.Password
                className="p-x-12 p-y-8"
                placeholder="Enter confirm password"
                onChange={(e) => {
                  setNewPasswordInfo((prev) => ({ ...prev, confirmPassword: e.target.value }));
                }}
              />
            </div>
            <div className="d-flex align-center justify-flex-end change-modal-footer gap-3 m-t-24">
              <Button type="button" onClick={() => setOpenPasswordModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Change Password</Button>
            </div>
          </Form>
        </section>
      </Modal>
    </>
  );
}
