'use client';

import { TableColumnsType, Tooltip } from 'antd';
import { ColumnGroupType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUsdToPolConverter } from '@/hooks/useUsdToPol';
import { DateRange } from '@components/date-picker/interface';
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
  useGetApprovedAssetsQuery,
  useGetAssetCategoriesQuery,
  useVerifyAssetMutation,
} from '@redux/apis/assets.api';
import { updateTotalDataCount } from '@redux/slices/pagination.slice';
import { useAppDispatch } from '@redux/store';

import { ApprovedAssetsInterface } from './approved-assets.interface';

export default function ApprovedAssets() {
  const approvedAssetsColumns: TableColumnsType<ApprovedAssetsInterface> = [
    {
      title: 'Asset',
      dataIndex: 'name',
      key: 'name',
      width: 320,
      fixed: 'left',
      render: (value, record: ApprovedAssetsInterface) => (
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
      width: 120,
      render: (value) => (
        <Tooltip title={value} placement="top">
          <p className="f-14-16-500 text-ellipsis">{value}</p>
        </Tooltip>
      ),
    },
    {
      title: 'Total Value',
      dataIndex: 'price',
      key: 'price',
      width: 200,
      sorter: (a, b) => Number(a) - Number(b),
      //Etherium cobversion : need to handle in future
      render: (value) => (
        <p className="f-14-16-500-t-d">
          ${value} / POL {convertUsdToPol(value)}
        </p>
      ),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: { placement: 'topRight', styles: { body: { boxShadow: 'none' } } },
      sortIcon: ({ sortOrder }) => {
        return getSortIcon({ sortOrder });
      },
    },
    {
      title: 'Price per token',
      dataIndex: 'pricePerToken',
      key: 'price',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">${value}</p>,
    },
    {
      title: 'Tokens allotted',
      dataIndex: 'tokens',
      key: 'tokens',
      width: 140,
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (value) => (
        <div
          className={`${value === ASSET_STATUS.LIVE ? 'bg-light-green' : ''} ${value === ASSET_STATUS.SOLD ? 'bg-error' : ''} ${value === ASSET_STATUS.GOING_LIVE ? 'bg-warning' : ''} radius-6 w-93 d-flex align-center justify-center`}
        >
          <p
            className={`${value === ASSET_STATUS.LIVE ? 'f-14-16-500-green' : ''} ${value === ASSET_STATUS.SOLD ? 'f-14-16-500-error' : ''} ${value === ASSET_STATUS.GOING_LIVE ? 'f-14-16-500-warning' : ''} p-y-8`}
          >
            {capitalizeFistLetter(value)}
          </p>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{capitalizeFistLetter(value)}</p>,
    },
    {
      title: 'Seller Name',
      dataIndex: 'sellerName',
      key: 'sellerId',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{capitalizeFistLetter(value)}</p>,
    },
    {
      title: 'Listed Date',
      dataIndex: 'listedDate',
      key: 'listedDate',
      sorter: (a, b) => new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime(),
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{dateFormatter(value) ?? '-'}</p>,
      showSorterTooltip: { placement: 'topRight', styles: { body: { boxShadow: 'none' } } },
      sortDirections: ['descend', 'ascend'],
      sortIcon: ({ sortOrder }) => {
        return getSortIcon({ sortOrder });
      },
    },
    {
      title: 'Total Views',
      dataIndex: '__v',
      key: '__v',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
    },
    // {
    //   dataIndex: '',
    //   key: 'approve-dropdown',
    //   title: '',
    //   width: 62,
    //   onCell: () => ({ className: 'hover-container' }),
    //   render: (record) => {
    //     const menuItems: MenuProps['items'] = [];

    //     if (record.status === ASSET_STATUS.SOLD) {
    //       menuItems.push(
    //         ...[
    //           {
    //             label: 'Delist',
    //             key: ASSET_MODAL_TYPE.DELIST,
    //             icon: <CircleX className="img-16" />,
    //           },
    //         ],
    //       );
    //     } else if (record.status === ASSET_STATUS.LIVE) {
    //       if (record.soldTokens > 0) {
    //         menuItems.push(
    //           ...[
    //             {
    //               label: 'Delist',
    //               key: ASSET_MODAL_TYPE.DELIST,
    //               icon: <CircleX className="img-16" />,
    //             },
    //           ],
    //         );
    //       } else {
    //         menuItems.push(
    //           ...[
    //             {
    //               label: 'Edit',
    //               key: ASSET_MODAL_TYPE.EDIT,
    //               icon: <PencilIcon className="img-16" />,
    //             },
    //             {
    //               label: 'Delist',
    //               key: ASSET_MODAL_TYPE.DELIST,
    //               icon: <CircleX className="img-16" />,
    //             },
    //             {
    //               label: 'Delete',
    //               key: ASSET_MODAL_TYPE.DELETE,
    //               icon: <Trash2 className="img-16" />,
    //             },
    //           ],
    //         );
    //       }
    //     } else if (record.status === ASSET_STATUS.GOING_LIVE) {
    //       menuItems.push(
    //         ...[
    //           {
    //             label: 'Edit',
    //             key: ASSET_MODAL_TYPE.EDIT,
    //             icon: <PencilIcon className="img-16" />,
    //           },
    //           {
    //             label: 'Hold',
    //             key: ASSET_MODAL_TYPE.HOLD,
    //             icon: <Pause className="img-16" />,
    //           },
    //           {
    //             label: 'Delete',
    //             key: ASSET_MODAL_TYPE.DELETE,
    //             icon: <Trash2 className="img-16" />,
    //           },
    //         ],
    //       );
    //     }

    //     return (
    //       <DropdownComponent
    //         menuItems={menuItems}
    //         label={
    //           <div
    //             className="bg-secondary hover-cell p-y-8 d-flex align-center justify-center radius-100 cursor-pointer"
    //             onClick={(e) => e.stopPropagation()}
    //           >
    //             <Ellipsis className="img-16" />
    //           </div>
    //         }
    //         handleClick={({ key }) => {
    //           setName(record.name);
    //           setAssetId(record.assetId);
    //           if (key === ASSET_MODAL_TYPE.EDIT) {
    //             router.push(`/asset-edit/${record.assetId}`);
    //           } else {
    //             setActionType(key as ActionType);
    //             setIsOpen(true);
    //           }
    //         }}
    //         triggerAction={['hover']}
    //         dropdownPlacement="bottomRight"
    //       />
    //     );
    //   },
    // },
  ];
  const dispatch = useAppDispatch();
  const { convertUsdToPol } = useUsdToPolConverter();
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
  } = useGetApprovedAssetsQuery(
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

  const handleResetClick = () => {
    setDateRange([null, null]);
    deleteSearchParams(['search', 'category', 'status']);
  };

  const handleConfirm = useCallback(async () => {
    if (actionType === ASSET_MODAL_TYPE.DELIST) {
      try {
        await verifyAsset({
          bodyData: {
            assetId,
            remarks,
            status: ASSET_STATUS.DELISTED,
          },
        });
        showSuccessToast(SUCCESS_MESSAGES.ASSET_DELISTED);
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
    } else if (actionType === ASSET_MODAL_TYPE.HOLD) {
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
    } else if (actionType === ASSET_MODAL_TYPE.DELETE) {
      try {
        await deleteAsset(assetId);
        showSuccessToast(SUCCESS_MESSAGES.ASSET_DELETED);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failure';

        showErrorToast(errorMessage);
      }
    }
    setIsOpen(false);
    refetch();
  }, [actionType, deleteAsset, refetch, assetId, remarks, verifyAsset]);

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
                className: 'custom-select w-165 h-44 table-menu',
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
                title: 'Status',
                className: 'custom-select w-165 h-44 table-menu',
                options: [
                  { label: 'Live', value: 'Live' },
                  { label: 'Going live', value: 'Going Live' },
                  { label: 'Sold', value: 'Sold' },
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
            onResetClick={handleResetClick}
            defaultSearchValue={search}
          />
          <div className="height-100 flex-column m-x-20 m-y-20">
            <TableComponent
              loading={isFetching || isLoading}
              data={assetList?.response.data as unknown as Record<string, unknown>[]}
              rowKey={'assetId'}
              columns={approvedAssetsColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
              handleTableChange={() => {}}
            />
            <StyledModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              className="max-w-460"
              type="approved"
              actionType={actionType}
              name={name}
              remarks={
                actionType === ASSET_MODAL_TYPE.DELETE ||
                actionType === ASSET_MODAL_TYPE.DELIST ||
                actionType === ASSET_MODAL_TYPE.HOLD
              }
              remarksText={remarks}
              setRemarksText={setRemarksText}
              handleCancel={() => setIsOpen(false)}
              handleConfirm={handleConfirm}
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
