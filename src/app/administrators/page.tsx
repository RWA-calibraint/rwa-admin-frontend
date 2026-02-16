'use client';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { TableColumnsType, Drawer, Form, Input, Modal, Spin } from 'antd';
import { ColumnGroupType } from 'antd/es/table/interface';
import { Plus, X as Close, Trash, LoaderCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import { SearchBox } from '@/components/search-box/search-box';
import { TableComponent } from '@/components/table/table';
import { useDebouncedSearch } from '@/hooks/useDebounce';
import { useGetAllAdminsQuery, useGetAdminProfileQuery, useDeleteAdminMutation } from '@/redux/apis/admin.api';
import { AdminInterface } from '@/redux/interfaces/admin.interface';
import { dateFormatter } from '@helpers/constants/services/date-formatter';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
// import { USER_STATUS } from '@helpers/constants/user-account-status';
import { capitalizeFistLetter } from '@helpers/services/text-formatter';
import { useUrlSearchParams } from '@hooks/useUrlSearchParams';
import { useSignupMutation } from '@redux/apis/auth.api';
import { updateTotalDataCount } from '@redux/slices/pagination.slice';
import { useAppDispatch } from '@redux/store';
import '@components/Select/style.scss';
import './style.scss';

export default function Administrators() {
  const [createAdmin, setCreateAdmin] = useState(false);
  const { getParam } = useUrlSearchParams();
  const dispatch = useAppDispatch();
  const page = Number(getParam('page', '1'));
  const size = Number(getParam('size', '10'));

  const [searchValue, setSearchValue] = useState('');
  const [createNewAdmin, setCreateNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteAdminId, setDeleteAdminId] = useState(null);
  const searchDebounceValue = useDebouncedSearch(searchValue, 700);
  const { data: allAdminsData, refetch } = useGetAllAdminsQuery({ page, size, searchValue: searchDebounceValue },{ refetchOnMountOrArgChange: true },);
  const { data: adminProfileResponse, isLoading: isProfileLoading } = useGetAdminProfileQuery({});
  const [deleteAdminMutation, { isLoading: loading }] = useDeleteAdminMutation();
  const [Signup, { isLoading }] = useSignupMutation();

  const resetCreateAdmin = () => {
    setCreateNewAdmin({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    });
  };

  useEffect(() => {
    if (allAdminsData?.response) {
      const totalDataCount = allAdminsData?.response?.total;

      dispatch(updateTotalDataCount(totalDataCount));
    }
  }, [dispatch, allAdminsData?.response]);

  useEffect(() => {
    if (searchDebounceValue.trim().length === 0) {
      refetch();
    }
  }, [searchDebounceValue, refetch]);

  const adminColumns: TableColumnsType<AdminInterface> = [
    {
      title: 'Admin Name',
      dataIndex: 'username',
      key: 'adminName',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <p className="f-14-16-600-primary">{`${capitalizeFistLetter(record?.firstName)} ${record?.lastName}`}</p>
      ),
    },

    {
      title: 'Admin Id',
      dataIndex: 'adminId',
      key: 'adminId',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{value ?? '1243'}</p>,
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
    },
    {
      title: 'Created On',
      key: 'createdOn',
      dataIndex: 'createdAt',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: '',
      width: 150,
      render: (value) => {
        if (
          !isProfileLoading &&
          adminProfileResponse?.response?.isSuperAdmin &&
          value?._id !== adminProfileResponse?.response?._id
        ) {
          return (
            <button
              className="cursor-pointer admin-delete-button"
              onClick={() => {
                setOpenDeleteModal(true);
                setDeleteAdminId(value?._id);
              }}
            >
              <Trash size={16} />
            </button>
          );
        }

        return <></>;
      },
    },
  ];

  const createNewAdminHandler = async () => {
    try {
      if (createNewAdmin.firstName && createNewAdmin.lastName && createNewAdmin.email && createNewAdmin.password) {
        await Signup(createNewAdmin).unwrap();
        showSuccessToast('Admin user created successfully');
        resetCreateAdmin();
        setCreateAdmin(false);
        refetch();
      } else {
        showErrorToast('All Field Required');
      }
    } catch (error) {
      const err = error as FetchBaseQueryError & {
        data?: { message?: string };
      };

      showErrorToast(JSON.stringify(err?.data?.message || 'Something went wrong'));
    }
  };

  const deleteAdminHandler = async () => {
    try {
      if (!deleteAdminId) return;

      await deleteAdminMutation(deleteAdminId).unwrap();
      setDeleteAdminId(null);
      setOpenDeleteModal(false);
      showSuccessToast('Admin deleted successfully');
      refetch();
    } catch (error) {
      showErrorToast((error as Error).message);
    }
  };

  return (
    <section className="p-20">
      <section className="d-flex align-center justify-space-between">
        <div className="d-flex">
          <SearchBox
            placeHolder="Search"
            className="w-300 h-44 m-r-12"
            onChange={(value) => {
              setSearchValue(value);
            }}
          />
          {/* <Select
            value={null}
            placeholder={'Account Status'}
            className="custom-select w-165 m-l-12 h-44 table-menu"
            options={[
              { label: 'Active', value: USER_STATUS.ACTIVE },
              { label: 'Suspended', value: USER_STATUS.SUSPENDED },
              { label: 'Terminated', value: USER_STATUS.TERMINATED },
            ]}
          ></Select> */}
        </div>
        <div>
          <Button onClick={() => setCreateAdmin(true)}>
            <Plus size={20} /> Create Admin
          </Button>
        </div>
      </section>
      <section className="m-t-24">
        <TableComponent
          columns={adminColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
          data={allAdminsData?.response?.data || []}
          className="no-pointer-row"
          rowKey={'_id'}
        />
      </section>
      <Drawer open={createAdmin} width={'600px'} closable={false} className="create-admin-drawer">
        <section className="d-flex align-center justify-space-between p-24 admin-drawer-header">
          <div>
            <h3 className="f-16-18-600-primary">Create Admin</h3>
          </div>
          <div
            className="p-6 cursor-pointer"
            onClick={() => {
              setCreateAdmin(false);
              resetCreateAdmin();
            }}
          >
            <Close size={20} />
          </div>
        </section>
        <Form onFinish={createNewAdminHandler}>
          <section className="p-24">
            <section className="d-flex align-center justify-space-between gap-5">
              <div>
                <label className="f-14-16-500-primary">
                  First Name <span className="f-14-16-500-error">*</span>
                </label>
                <Input
                  className="p-x-12 p-y-8 w-270 m-t-8"
                  value={createNewAdmin.firstName}
                  onChange={(e) => {
                    setCreateNewAdmin((prev) => ({ ...prev, firstName: e.target.value }));
                  }}
                  placeholder="Enter First Name"
                />
              </div>
              <div>
                <label className="f-14-16-500-primary">
                  Last Name <span className="f-14-16-500-error">*</span>
                </label>
                <Input
                  className="p-x-12 p-y-8 w-270 m-t-8"
                  value={createNewAdmin.lastName}
                  onChange={(e) => {
                    setCreateNewAdmin((prev) => ({ ...prev, lastName: e.target.value }));
                  }}
                  placeholder="Enter Last Name"
                />
              </div>
            </section>
            <section className="d-flex align-center justify-space-between gap-5 m-t-16">
              <div>
                <label className="f-14-16-500-primary">
                  Email Address <span className="f-14-16-500-error">*</span>
                </label>
                <Input
                  className="p-x-12 p-y-8 w-270 m-t-8"
                  value={createNewAdmin.email}
                  onChange={(e) => {
                    setCreateNewAdmin((prev) => ({ ...prev, email: e.target.value }));
                  }}
                  placeholder="Enter Email Address"
                />
              </div>
              <div>
                <label className="f-14-16-500-primary">
                  Password <span className="f-14-16-500-error">*</span>
                </label>
                <Input
                  className="p-x-12 p-y-8 w-270 m-t-8"
                  value={createNewAdmin.password}
                  onChange={(e) => {
                    setCreateNewAdmin((prev) => ({ ...prev, password: e.target.value }));
                  }}
                  placeholder="Enter Password"
                />
              </div>
            </section>
          </section>
          <section className="admin-drawer-footer d-flex align-center justify-flex-end p-24 gap-5">
            <Button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setCreateAdmin(false);
                resetCreateAdmin();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="create-btn" loading={isLoading}>
              Create Admin
            </Button>
          </section>
        </Form>
      </Drawer>
      <Modal open={openDeleteModal} footer={false} closable={false} centered>
        <section className="p-x-24 p-y-24">
          <h3>Delete Admin</h3>
          <p>Are you sure you want to delete this admin from our app?</p>
          <div className="d-flex align-center justify-flex-end p-t-24">
            <button
              key="cancel"
              className="bg-white p-x-16 p-y-12 m-r-12 f-14-20-500-t-o-s radius-6 border-primary-1 cursor-pointer"
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              key="submit"
              className={`p-x-16 p-y-12 radius-6 f-14-20-500-brand-white bg-approve-button border-primary-1 cursor-pointer`}
              onClick={deleteAdminHandler}
              disabled={loading}
            >
              {loading && <Spin indicator={<LoaderCircle className="icon-white spin" />} size="small" />}
              Delete Admin
            </button>
          </div>
        </section>
      </Modal>
    </section>
  );
}
