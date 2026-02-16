'use client';

import { MenuProps, TableColumnsType } from 'antd';
import { ColumnGroupType } from 'antd/es/table/interface';
import { Ban, Ellipsis, User, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { SUCCESS_MESSAGES } from '@/helpers/constants/succes-messages';
import DropdownComponent from '@components/dropdown/dropdown';
import { ActionType } from '@components/modal/interface';
import StyledModal from '@components/modal/modal';
import { NoDataFound } from '@components/no-data-found/no-data-found';
import { TableComponent } from '@components/table/table';
import { TableMenuComponents } from '@components/table-menus/table-menu';
import { dateFormatter } from '@helpers/constants/services/date-formatter';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
import { USER_STATUS } from '@helpers/constants/user-account-status';
import { capitalizeFistLetter } from '@helpers/services/text-formatter';
import { useUrlSearchParams } from '@hooks/useUrlSearchParams';
import {
  useGetUserListQuery,
  useLazyUpdateUserAsBlockOrActiveQuery,
  useLazyUpdateUserAsSuspendQuery,
} from '@redux/apis/user-management.api';
import { UserInterface } from '@redux/interfaces/user-management.interface';
import { updateTotalDataCount } from '@redux/slices/pagination.slice';
import { useAppDispatch } from '@redux/store';

export default function UserManagement() {
  const userColumns: TableColumnsType<UserInterface> = [
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <p className="f-14-16-600-primary">{`${capitalizeFistLetter(record?.firstName)} ${record?.lastName}`}</p>
      ),
      onCell: () => ({ style: { cursor: 'default' } }),
    },

    {
      title: 'UserID',
      dataIndex: 'userId',
      key: 'userId',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{value ?? '1243'}</p>,
      onCell: () => ({ style: { cursor: 'default' } }),
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
      onCell: () => ({ style: { cursor: 'default' } }),
    },
    {
      title: 'Wallet Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      width: 250,
      render: (value) => <p className="f-14-16-500-t-d">{value ?? '-'}</p>,
      onCell: () => ({ style: { cursor: 'default' } }),
    },
    {
      title: 'Registered Date',
      key: 'registeredDate',
      dataIndex: 'createdAt',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
      onCell: () => ({ style: { cursor: 'default' } }),
    },
    {
      title: 'Account Status',
      key: 'accountStatus',
      dataIndex: 'status',
      width: 200,
      render: (value) => (
        <div
          className={`${value === USER_STATUS.ACTIVE ? 'bg-light-green' : ''} ${value === USER_STATUS.TERMINATED ? 'bg-error' : ''} ${value === USER_STATUS.SUSPENDED ? 'bg-warning' : ''} radius-6 w-93  d-flex align-center justify-center`}
        >
          <p
            className={`${value === USER_STATUS.ACTIVE ? 'f-14-16-500-green' : ''} ${value === USER_STATUS.TERMINATED ? 'f-14-16-500-error' : ''} ${value === USER_STATUS.SUSPENDED ? 'f-14-16-500-warning' : ''} p-y-8`}
          >
            {capitalizeFistLetter(value)}
          </p>
        </div>
      ),
      onCell: () => ({ style: { cursor: 'default' } }),
    },
    {
      title: 'Status Date',
      key: 'statusDate',
      width: 180,
      render: (record) => {
        const value = dateFormatter(
          record.status === USER_STATUS.SUSPENDED ? record.suspendExpiryAt : record.updatedAt,
        );

        return <p className="f-14-16-500-t-d">{value}</p>;
      },
      onCell: () => ({ style: { cursor: 'default' } }),
    },
    {
      title: 'Transactions',
      key: 'transactionsCount',
      dataIndex: 'transactionsCount',
      width: 180,
      render: (value) => <p className="f-14-16-500-t-d">{value ?? 0}</p>,
      onCell: () => ({ style: { cursor: 'default' } }),
    },
    {
      dataIndex: '',
      key: 'approve-dropdown',
      title: '',
      onCell: () => ({ className: 'hover-container' }),
      width: 62,
      render: (record) => {
        const menuItems: MenuProps['items'] = [];

        if (record.status === USER_STATUS.ACTIVE)
          menuItems.push(
            ...[
              {
                label: 'Suspend user',
                key: USER_STATUS.SUSPENDED,
                icon: <UserX className="img-16" />,
              },
              {
                label: 'Terminate user',
                key: USER_STATUS.TERMINATED,
                icon: <Ban className="img-16" />,
              },
            ],
          );
        else if (record.status === USER_STATUS.SUSPENDED) {
          menuItems.push(
            ...[
              {
                label: 'Activate user',
                key: USER_STATUS.ACTIVE,
                icon: <User className="img-16" />,
              },
              {
                label: 'Terminate user',
                key: USER_STATUS.TERMINATED,
                icon: <Ban className="img-16" />,
              },
            ],
          );
        } else if (record.status === USER_STATUS.TERMINATED) {
          menuItems.push({
            label: 'Activate user',
            key: USER_STATUS.ACTIVE,
            icon: <User className="img-16" />,
          });
        }

        return (
          <DropdownComponent
            menuItems={menuItems}
            label={
              <div className="bg-secondary hover-cell p-y-8 d-flex align-center justify-center radius-100 cursor-pointer">
                <Ellipsis className="img-16 action-icon" />
              </div>
            }
            handleClick={({ key }) => {
              setActionType(key as ActionType);
              setSelectedUser(record);
              setIsOpen(true);
            }}
            triggerAction={['hover']}
            dropdownPlacement="bottomRight"
          />
        );
      },
    },
  ];

  const dispatch = useAppDispatch();
  const { getParam, updateSearchParams, deleteSearchParams } = useUrlSearchParams();

  const page = Number(getParam('page', '1'));
  const size = Number(getParam('size', '10'));
  const status = getParam('status', '');
  const search = getParam('search', '');

  const {
    data: userList,
    isFetching,
    isLoading: getListLoading,
    refetch,
  } = useGetUserListQuery({ page, size, status, search }, { refetchOnMountOrArgChange: true });
  const [updateUserStatus, { isLoading: updateLoading }] = useLazyUpdateUserAsBlockOrActiveQuery();
  const [updateUserAsSuspend, { isLoading: suspendLoading }] = useLazyUpdateUserAsSuspendQuery();

  const [actionType, setActionType] = useState<ActionType>(USER_STATUS.ACTIVE);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserInterface>();
  const [suspendExpiryDate, setSuspendExpiryDate] = useState<Date | null>(null);
  const [remarks, setRemarks] = useState('');
  const showRemarks = [USER_STATUS.TERMINATED, USER_STATUS.SUSPENDED];

  const router = useRouter();

  useEffect(() => {
    if (userList?.response) {
      const totalDataCount = userList?.response?.total;

      dispatch(updateTotalDataCount(totalDataCount));
    }
  }, [dispatch, userList?.response]);

  const handleResetClick = () => {
    deleteSearchParams(['search', 'status']);
  };

  const handleConfirm = async () => {
    setIsOpen(false);

    if (actionType === USER_STATUS.SUSPENDED) {
      try {
        const bodyData: Record<string, unknown> = {};

        if (suspendExpiryDate) {
          bodyData.suspendExpiryAt = String(suspendExpiryDate);
        }

        await updateUserAsSuspend({
          userId: String(selectedUser?.userId),
          bodyData: { description: remarks, ...bodyData },
        });
        showSuccessToast(SUCCESS_MESSAGES.USER_SUSPENDED);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failure';

        showErrorToast(errorMessage);
      }
    } else {
      try {
        await updateUserStatus({
          userId: String(selectedUser?.userId),
          bodyData: { status: actionType as USER_STATUS, description: remarks },
        });
        showSuccessToast(
          actionType === USER_STATUS.ACTIVE ? SUCCESS_MESSAGES.USER_ACTIVATED : SUCCESS_MESSAGES.USER_TERMINATED,
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failure';

        showErrorToast(errorMessage);
      }
    }
    setSuspendExpiryDate(null);
    refetch();
  };

  const isLoading = useMemo(
    () => getListLoading || updateLoading || suspendLoading,
    [getListLoading, updateLoading, suspendLoading],
  );

  return (
    <>
      {(userList && userList.response.data.length > 0) || search || isLoading || status || isFetching ? (
        <>
          <TableMenuComponents
            selectList={[
              {
                title: 'Account Status',
                className: 'custom-select w-165 m-l-12 h-44 table-menu',
                options: [
                  { label: 'Active', value: USER_STATUS.ACTIVE },
                  { label: 'Suspended', value: USER_STATUS.SUSPENDED },
                  { label: 'Terminated', value: USER_STATUS.TERMINATED },
                ],
                onChange: (value) => {
                  updateSearchParams({ status: value.join(','), page: 1, size: 10 });
                },
              },
            ]}
            defaultSearchValue={search}
            datePickerOptions={{ enable: false, onChange: () => {} }}
            onSearchValueChange={(value) => {
              updateSearchParams({ search: value, page: 1, size: 10 });
            }}
            onResetClick={handleResetClick}
          />
          <div className="height-100 flex-column m-x-20 m-y-20">
            <TableComponent
              loading={isFetching || isLoading}
              data={userList?.response?.data as unknown as Record<string, unknown>[]}
              rowKey={'_id'}
              columns={userColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
              handleTableChange={() => {}}
              onRow={(record) => ({
                onClick: () => {
                  router.push(`/user-management/${record._id}`);
                },
              })}
            />
            <StyledModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              className="max-w-460"
              type="users"
              actionType={actionType}
              onDateChange={(date: string) => {
                if (date) setSuspendExpiryDate(new Date(date));
              }}
              handleConfirm={handleConfirm}
              name={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
              hasSuspensionPeriod={actionType === USER_STATUS.SUSPENDED}
              handleCancel={() => {
                setSuspendExpiryDate(null);
                setIsOpen(false);
                setRemarks('');
              }}
              remarks={showRemarks.includes(actionType as USER_STATUS)}
              remarksText={remarks}
              setRemarksText={setRemarks}
              loading={isLoading}
            />
          </div>
        </>
      ) : (
        <NoDataFound
          className="h-calc-100"
          title="No Data Available"
          description="There’s nothing to display here yet. Check back later!"
        />
      )}
    </>
  );
}
