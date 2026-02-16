'use client';

import { MenuProps, TableColumnsType, Tooltip } from 'antd';
import { ColumnGroupType } from 'antd/es/table';
import { Ellipsis, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DateRange } from '@components/date-picker/interface';
import DropdownComponent from '@components/dropdown/dropdown';
import { ActionType } from '@components/modal/interface';
import StyledModal from '@components/modal/modal';
import { NoDataFound } from '@components/no-data-found/no-data-found';
import { TableComponent } from '@components/table/table';
import { TableMenuComponents } from '@components/table-menus/table-menu';
import { ASSET_MODAL_TYPE } from '@helpers/constants/asset.status';
import { dateFormatter, toLocalISOString } from '@helpers/constants/services/date-formatter';
import { getSortIcon } from '@helpers/constants/services/get-sort-icon';
import { SUCCESS_MESSAGES } from '@helpers/constants/succes-messages';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
import { capitalizeFistLetter } from '@helpers/services/text-formatter';
import { truncateName } from '@helpers/services/truncate-name';
import { useUrlSearchParams } from '@hooks/useUrlSearchParams';
import { useDeleteAssetMutation, useGetAssetCategoriesQuery, useGetRejectedAssetsQuery } from '@redux/apis/assets.api';
import { updateTotalDataCount } from '@redux/slices/pagination.slice';
import { useAppDispatch } from '@redux/store';

import { RejectedAssetsInterface } from './rejected-assets.interface';

import '@app/asset/rejected-assets/rejected.module.scss';

export default function RejectedAssets() {
  const rejectedAssetsColumns: TableColumnsType<RejectedAssetsInterface> = [
    {
      title: 'Asset',
      dataIndex: 'name',
      key: 'name',
      width: 320,
      fixed: 'left',
      render: (value, record: RejectedAssetsInterface) => (
        <div className="d-flex align-center">
          <Image src={record.coverImage} className="radius-6 img-fit-contain" alt="asets" height={40} width={40} />
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
      render: (value) => <p className="f-14-16-500-t-d">{capitalizeFistLetter(value)}</p>,
    },
    {
      title: 'Seller Name',
      dataIndex: 'sellerName',
      key: 'sellerId',
      width: 200,
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
    },

    {
      title: 'Submission Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      sorter: (a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime(),
      render: (value) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: { placement: 'topRight', styles: { body: { boxShadow: 'none' } } },
      sortIcon: ({ sortOrder }) => {
        return getSortIcon({ sortOrder });
      },
    },
    {
      title: 'Rejected Date',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      width: 200,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (value) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: { placement: 'topRight', styles: { body: { boxShadow: 'none' } } },
      sortIcon: ({ sortOrder }) => {
        return getSortIcon({ sortOrder });
      },
    },
    {
      title: 'Rejection Reason',
      key: 'adminRemarks',
      dataIndex: 'adminRemarks',
      width: 250,
      render: (value) => (
        <Tooltip title={value} placement="top">
          <p className=" f-14-16-500 text-ellipsis">{capitalizeFistLetter(value)}</p>
        </Tooltip>
      ),
    },
    // removed for now , may be used in future
    // {
    //   title: 'Rejected Count',
    //   key: 'rejectionCount',
    //   dataIndex: 'rejectionCount',
    //   width: 200,
    //   render: (value) => <p className="f-14-16-500-t-d">{value ?? 0}</p>,
    // },
    {
      dataIndex: '',
      key: 'approve-dropdown',
      title: '',
      width: 62,
      onCell: () => ({ className: 'hover-container' }),
      render: (record) => {
        const menuItems: MenuProps['items'] = [];

        menuItems.push(
          ...[
            {
              label: 'Delete',
              key: ASSET_MODAL_TYPE.DELETE,
              icon: <Trash2 className="img-16" />,
            },
          ],
        );

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
              setActionType(key as ActionType);
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
  } = useGetRejectedAssetsQuery(
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
  const { data: categoryList } = useGetAssetCategoriesQuery();
  const [deleteAsset, { isLoading }] = useDeleteAssetMutation();
  const [actionType, setActionType] = useState<ActionType>(ASSET_MODAL_TYPE.APPROVE);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [assetId, setAssetId] = useState<string>('');
  const [remarksText, setRemarksText] = useState<string>('');

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
    deleteSearchParams(['search', 'category']);
  };

  const handleConfirm = async () => {
    if (actionType === ASSET_MODAL_TYPE.DELETE) {
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
  };

  const filters = [status, category, search].some((value) => value !== '');
  const isValidDate = dateRange.every((date) => date !== null);

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
          />
          <div className="height-100 flex-column m-x-20 m-y-20">
            <TableComponent
              loading={isFetching || isLoading}
              data={assetList?.response.data as unknown as Record<string, unknown>[]}
              rowKey={'assetId'}
              columns={rejectedAssetsColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
              handleTableChange={() => {}}
            />
            <StyledModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              type="rejected"
              actionType={actionType}
              name={name}
              remarks={actionType === ASSET_MODAL_TYPE.DELETE}
              remarksText={remarksText}
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
