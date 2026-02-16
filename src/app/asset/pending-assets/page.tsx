'use client';

import { Button, MenuProps, TableColumnsType, Tooltip } from 'antd';
import { ColumnGroupType } from 'antd/es/table';
import { CheckCircle2, Ellipsis, Pause, PencilIcon, Trash2, X, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DateRange } from '@components/date-picker/interface';
import DropdownComponent from '@components/dropdown/dropdown';
import { ActionType } from '@components/modal/interface';
import StyledModal from '@components/modal/modal';
import { NoDataFound } from '@components/no-data-found/no-data-found';
import { TableComponent } from '@components/table/table';
import { TableMenuComponents } from '@components/table-menus/table-menu';
import { ASSET_MODAL_TYPE, ASSET_STATUS } from '@helpers/constants/asset.status';
import { dateFormatter, toLocalISOString } from '@helpers/constants/services/date-formatter';
import { getSortIcon } from '@helpers/constants/services/get-sort-icon';
import { SUCCESS_MESSAGES } from '@helpers/constants/succes-messages';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
import { capitalizeFistLetter } from '@helpers/services/text-formatter';
import { truncateName } from '@helpers/services/truncate-name';
import { useUrlSearchParams } from '@hooks/useUrlSearchParams';
import {
  useDeleteAssetMutation,
  useGetAssetCategoriesQuery,
  useGetPendingAssetsQuery,
  useVerifyAssetMutation,
} from '@redux/apis/assets.api';
import { updateTotalDataCount } from '@redux/slices/pagination.slice';
import { useAppDispatch } from '@redux/store';

import { PendingAssetsInterface } from './pending-assets.interface';

const showRemarks = [ASSET_MODAL_TYPE.DELIST, ASSET_MODAL_TYPE.HOLD, ASSET_MODAL_TYPE.REJECT, ASSET_MODAL_TYPE.DELETE];

export default function PendingAssets() {
  const pendingAssetsColumns: TableColumnsType<PendingAssetsInterface> = [
    {
      title: 'Asset',
      dataIndex: 'name',
      key: 'name',
      width: 320,
      fixed: 'left',
      render: (value, record: PendingAssetsInterface) => (
        <div className="d-flex align-center">
          <Image src={record.coverImage} className="radius-6 img-fit-contain" alt="assets" height={40} width={40} />
          <h3 className="f-14-16-600-primary m-l-14">{capitalizeFistLetter(truncateName(value))}</h3>
        </div>
      ),
    },
    {
      title: 'Asset ID',
      dataIndex: 'assetId',
      key: 'assetId',
      width: 200,
      render: (value) => (
        <Tooltip title={value} placement="top">
          <p className="f-14-16-500 text-ellipsis">{value}</p>
        </Tooltip>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d text-secondary-color">{capitalizeFistLetter(value)}</p>,
    },
    {
      title: 'Seller Name',
      dataIndex: 'sellerName',
      key: 'sellerId',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{capitalizeFistLetter(value)}</p>,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: { placement: 'topRight', styles: { body: { boxShadow: 'none' } } },
      sortIcon: ({ sortOrder }) => {
        return getSortIcon({ sortOrder });
      },
    },
    {
      title: 'Asset Status',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (value) => (
        <div
          className={`${value === ASSET_STATUS.NEWLY_ADDED ? 'bg-light-green' : ''} ${value === ASSET_STATUS.DELISTED ? 'bg-error' : ''} ${value === ASSET_STATUS.RE_SUBMITTED ? 'bg-warning' : ''} ${value === ASSET_STATUS.HOLD ? 'bg-badge-bg-blue' : ''} radius-6 w-120 d-flex align-center justify-center`}
        >
          <p
            className={`${value === ASSET_STATUS.NEWLY_ADDED ? 'f-14-16-500-green' : ''} ${value === ASSET_STATUS.DELISTED ? 'f-14-16-500-error' : ''} ${value === ASSET_STATUS.RE_SUBMITTED ? 'f-14-16-500-warning' : ''} ${value === ASSET_STATUS.HOLD ? 'f-14-16-500-badge-hold' : ''} p-y-8`}
          >
            {capitalizeFistLetter(value)}
          </p>
        </div>
      ),
    },
    {
      dataIndex: '',
      key: 'approve-dropdown',
      title: '',
      width: 75,
      onCell: () => ({ className: 'hover-container' }),
      render: (record) => {
        const menuItems: MenuProps['items'] = [];

        if (record.status === ASSET_STATUS.NEWLY_ADDED || record.status === ASSET_STATUS.RE_SUBMITTED) {
          menuItems.push(
            ...[
              {
                label: 'Edit',
                key: ASSET_MODAL_TYPE.EDIT,
                icon: <PencilIcon className="img-16" />,
              },
              {
                label: 'Reject Asset',
                key: ASSET_MODAL_TYPE.REJECT,
                icon: <X className="img-16" />,
              },
              {
                label: 'Hold',
                key: ASSET_MODAL_TYPE.HOLD,
                icon: <Pause className="img-16" />,
              },
            ],
          );
        } else if (record.status === ASSET_STATUS.HOLD) {
          menuItems.push(
            ...[
              {
                label: 'Edit',
                key: ASSET_MODAL_TYPE.EDIT,
                icon: <PencilIcon className="img-16" />,
              },
              {
                label: 'Reject Asset',
                key: ASSET_MODAL_TYPE.REJECT,
                icon: <X className="img-16" />,
              },
              {
                label: 'Release Asset',
                key: ASSET_MODAL_TYPE.RELEASE,
                icon: <Check className="img-16" />,
              },
            ],
          );
        } else if (record.status === ASSET_STATUS.DELISTED) {
          menuItems.push(
            ...[
              {
                label: 'Edit',
                key: ASSET_MODAL_TYPE.EDIT,
                icon: <PencilIcon className="img-16" />,
              },
              {
                label: 'List',
                key: ASSET_MODAL_TYPE.LIST,
                icon: <CheckCircle2 className="img-16" />,
                disabled: record?.sellerStatus !== 'active',
              },
              {
                label: 'Delete',
                key: ASSET_MODAL_TYPE.DELETE,
                icon: <Trash2 className="img-16" />,
              },
            ],
          );
        }
        if (menuItems.length === 0) {
          return null;
        }

        return (
          <DropdownComponent
            menuItems={menuItems}
            label={
              <div
                className="bg-secondary hover-cell p-y-8 d-flex align-center justify-center radius-100 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Ellipsis className="img-16" />
              </div>
            }
            handleClick={({ key }) => {
              setName(record.name);
              setAssetId(record.assetId);
              if (key === ASSET_MODAL_TYPE.EDIT) {
                router.push(`/asset-edit/${record.assetId}`);
              } else {
                setActionType(key as ActionType);
                setIsOpen(true);
              }
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
  const router = useRouter();
  const page = Number(getParam('page', '1'));
  const size = Number(getParam('size', '10'));
  const status = getParam('status', '');
  const search = getParam('search', '');
  const category = getParam('category', '');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const {
    data: assetList,
    isFetching,
    refetch,
  } = useGetPendingAssetsQuery(
    {
      search,
      category,
      status,
      page,
      size,
      startDate: toLocalISOString(dateRange[0]) ?? '',
      endDate: toLocalISOString(dateRange[1]) ?? '',
    },
    { refetchOnMountOrArgChange: true },
  );
  const [verifyAsset, { isLoading: verifyLoading }] = useVerifyAssetMutation();
  const [deleteAsset, { isLoading: deleteLoading }] = useDeleteAssetMutation();
  const { data: categoryList } = useGetAssetCategoriesQuery();
  const [actionType, setActionType] = useState<ActionType>(ASSET_MODAL_TYPE.APPROVE);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [assetId, setAssetId] = useState<string>('');
  const [remarks, setRemarksText] = useState('');

  const handleRowClick = (record: Record<string, unknown>) => {
    router.push(`/asset/${record.assetId}`);
  };

  useEffect(() => {
    if (assetList?.response) {
      const totalDataCount = assetList?.response?.total;

      dispatch(updateTotalDataCount(totalDataCount));
    }
  }, [dispatch, assetList?.response]);

  const handleAssetClick = () => {
    router.push(`/create-asset`);
  };

  const handleResetClick = () => {
    setDateRange([null, null]);
    deleteSearchParams(['search', 'category', 'status']);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setRemarksText('');
  };

  const handleConfirm = useCallback(async () => {
    setIsOpen(false);
    if (actionType === ASSET_MODAL_TYPE.HOLD) {
      try {
        await verifyAsset({
          bodyData: {
            assetId,
            remarks,
            status: ASSET_STATUS.HOLD,
          },
        });
        showSuccessToast(SUCCESS_MESSAGES.ASSET_HOLD);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failure';

        showErrorToast(errorMessage);
      }
    } else if (actionType === ASSET_MODAL_TYPE.RELEASE) {
      try {
        await verifyAsset({
          bodyData: {
            assetId,
            status: ASSET_STATUS.NEWLY_ADDED,
          },
        });
        showSuccessToast(SUCCESS_MESSAGES.ASSET_HOLD);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failure';

        showErrorToast(errorMessage);
      }
    } else if (actionType === ASSET_MODAL_TYPE.REJECT) {
      try {
        await verifyAsset({
          bodyData: {
            assetId,
            remarks,
            status: ASSET_STATUS.REJECTED,
          },
        });
        showSuccessToast(SUCCESS_MESSAGES.ASSET_REJECTED);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failure';

        showErrorToast(errorMessage);
      }
    } else if (actionType === ASSET_MODAL_TYPE.LIST) {
      try {
        await verifyAsset({
          bodyData: {
            assetId,
            remarks,
            status: ASSET_STATUS.LIVE,
          },
        });
        showSuccessToast(SUCCESS_MESSAGES.ASSET_LIST);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failure';

        showErrorToast(errorMessage);
      }
    } else if (actionType === ASSET_MODAL_TYPE.DELETE) {
      try {
        await deleteAsset(assetId);
        showSuccessToast(SUCCESS_MESSAGES.ASSET_DELETED);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failure';

        showErrorToast(errorMessage);
      }
    }
    refetch();
    setIsOpen(false);
  }, [actionType, assetId, deleteAsset, refetch, remarks, verifyAsset]);

  const filters = [status, category, search].some((value) => value !== '');
  const isValidDate = dateRange.every((date) => date !== null);
  const isLoading = useMemo(() => verifyLoading || deleteLoading, [verifyLoading, deleteLoading]);

  return (
    <>
      {(assetList && assetList.response.data.length > 0) || filters || isValidDate || isLoading || isFetching ? (
        <>
          <TableMenuComponents
            selectList={[
              {
                title: 'Category',
                className: 'custom-select w-165 m-l-12 h-44 table-menu',
                options: categoryList
                  ? categoryList.response.map((category) => ({
                      label: category.category,
                      value: category._id,
                    }))
                  : [],
                onChange: (value) => {
                  updateSearchParams({ category: value.join(','), page: 1 });
                },
              },
              {
                title: 'Submission Status',
                className: 'custom-select w-165 m-l-12 h-44 table-menu',
                options: [
                  { label: 'Newly added', value: 'Newly added' },
                  { label: 'Re-submitted', value: 'Re-submitted' },
                  { label: 'Hold', value: 'Hold' },
                  { label: 'Delisted', value: 'Delisted' },
                ],
                onChange: (value) => {
                  updateSearchParams({ status: value.join(','), page: 1 });
                },
              },
            ]}
            datePickerOptions={{
              enable: true,
              onChange: (date: DateRange) => {
                setDateRange(date ?? [null, null]);
                updateSearchParams({ page: 1 });
              },
            }}
            onSearchValueChange={(value) => {
              updateSearchParams({ search: value, page: 1 });
            }}
            onAssetClick={handleAssetClick}
            onResetClick={handleResetClick}
            defaultSearchValue={search}
          />
          <div className="height-100 flex-column m-x-20 m-y-20">
            <TableComponent
              loading={isFetching || isLoading}
              data={assetList?.response.data as unknown as Record<string, unknown>[]}
              rowKey={'assetId'}
              columns={pendingAssetsColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
              handleTableChange={() => {}}
            />
            <StyledModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              className="max-w-460"
              type="pending"
              actionType={actionType}
              name={name}
              remarks={showRemarks.includes(actionType as ASSET_MODAL_TYPE)}
              remarksText={remarks}
              setRemarksText={setRemarksText}
              handleCancel={handleCancel}
              handleConfirm={handleConfirm}
              loading={isLoading}
            />
          </div>
        </>
      ) : (
        <>
          <div className="d-flex justify-flex-end">
            <Button className="m-t-20 m-r-20" type="primary" onClick={() => router.push('/create-asset')}>
              Submit New Asset
            </Button>
          </div>
          <NoDataFound
            className="h-calc-100"
            title="No Data Available"
            description="There’s nothing to display here yet. Check back later!"
          />
        </>
      )}
    </>
  );
}
