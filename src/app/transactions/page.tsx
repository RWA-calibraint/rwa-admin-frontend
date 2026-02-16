'use client';

import '@app/transactions/transactions.scss';

import { TableColumnsType } from 'antd';
import { ColumnGroupType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import { useUsdToPolConverter } from '@/hooks/useUsdToPol';
import { ActionType } from '@components/modal/interface';
import StyledModal from '@components/modal/modal';
import { NoDataFound } from '@components/no-data-found/no-data-found';
import { TableComponent } from '@components/table/table';
import { TableMenuComponents } from '@components/table-menus/table-menu';
import { dateFormatter, toLocalISOString } from '@helpers/constants/services/date-formatter';
import { TRANSACTION_METHOD, TRANSACTION_STATUS } from '@helpers/constants/transactions';
import { capitalizeFistLetter, truncateString } from '@helpers/services/text-formatter';
import { useUrlSearchParams } from '@hooks/useUrlSearchParams';
import { useGetAllTransactionsQuery } from '@redux/apis/transaction.api';
import { Transaction } from '@redux/interfaces/transaction.interface';
import { updateTotalDataCount } from '@redux/slices/pagination.slice';
import { useAppDispatch } from '@redux/store';

export default function Transactions() {
  const transactionListColumns: TableColumnsType<Transaction> = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      fixed: 'left',
      render: (value) => <p className="f-14-16-500-t-d">{truncateString(value, 16, '....')}</p>,
      width: 200,
    },
    {
      title: 'Buyer Name',
      dataIndex: 'buyerName',
      key: 'buyerName',
      render: (value) => <p className="f-14-16-500-t-d">{capitalizeFistLetter(value)}</p>,
      width: 200,
    },
    {
      title: 'Seller Name',
      dataIndex: 'sellerName',
      key: 'sellerName',
      render: (value) => <p className="f-14-16-500-t-d">{capitalizeFistLetter(value)}</p>,
      width: 200,
    },
    {
      title: 'Asset Name',
      dataIndex: 'assetName',
      key: 'assetName',
      render: (value) => <p className="f-14-16-600-primary">{capitalizeFistLetter(value)}</p>,
      width: 250,
    },
    {
      title: 'Amount',
      key: 'amountUSD',
      dataIndex: 'amount',
      render: (value) => (
        <p className="f-14-16-500-t-d">
          ${value} / POL {convertUsdToPol(value)}
        </p>
      ),
      width: 200,
    },
    {
      title: 'Tokens brought',
      key: 'tokensBrought',
      dataIndex: 'tokenCount',
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
      width: 200,
    },
    {
      title: 'Payment Status',
      key: 'paymentStatus',
      dataIndex: 'paymentStatus',
      width: 200,
      render: (value) => (
        <div
          className={`d-flex align-center justify-center radius-6 w-98 ${value === TRANSACTION_STATUS.REFUNDED ? 'bg-chip-refund' : ''} ${value === TRANSACTION_STATUS.FAILED ? 'bg-error' : ''} ${value === TRANSACTION_STATUS.PENDING ? 'bg-warning' : ''} ${value === TRANSACTION_STATUS.COMPLETED ? 'bg-chip-success' : ''}`}
        >
          <p
            className={`p-y-8 ${value === TRANSACTION_STATUS.REFUNDED ? 'f-14-16-500-blue' : ''} ${value === TRANSACTION_STATUS.FAILED ? 'f-14-16-500-error' : ''} ${value === TRANSACTION_STATUS.COMPLETED ? 'f-14-16-500-success' : ''} ${value === TRANSACTION_STATUS.PENDING ? 'f-14-16-500-warning' : ''}`}
          >
            {capitalizeFistLetter(value)}
          </p>
        </div>
      ),
    },
    {
      title: 'Payment Method',
      key: 'paymentMethod',
      dataIndex: 'paymentMethod',
      width: 180,
      render: (value) => <p className="f-14-16-500-t-d">{capitalizeFistLetter(value)}</p>,
    },
    {
      title: 'Transaction Date',
      key: 'transactionDate',
      dataIndex: 'transactionDate',
      render: (value) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
      width: 200,
    },
    // {
    //   key: 'approve-dropdown',
    //   title: '',
    //   width: 62,
    //   onCell: () => ({ className: 'hover-container' }),
    //   render: (record) => {
    //     const menuItems = [];

    //     menuItems.push({
    //       label: 'Refund',
    //       key: '1',
    //       icon: <CircleDollarSign className="img-16" />,
    //     });

    //     return (
    //       <DropdownComponent
    //         menuItems={menuItems}
    //         label={
    //           <div className="bg-secondary hover-cell p-y-8 d-flex align-center justify-center radius-100">
    //             <Ellipsis className="img-16" />
    //           </div>
    //         }
    //         handleClick={({ key }) => {
    //           setActionType(key as ActionType);
    //           setName(record.transactionId);
    //           setIsOpen(true);
    //         }}
    //         triggerAction={['hover']}
    //         dropdownPlacement="bottomRight"
    //       />
    //     );
    //   },
    // },
  ];

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState('');
  const { convertUsdToPol } = useUsdToPolConverter();
  // const [actionType, setActionType] = useState<ActionType>(PAYMENT_STATUS.REFUND);

  const dispatch = useAppDispatch();
  const { getParam, updateSearchParams, deleteSearchParams } = useUrlSearchParams();

  const page = Number(getParam('page', '1'));
  const size = Number(getParam('size', '10'));
  const paymentStatus = getParam('payment-status', '');
  const paymentMethod = getParam('payment-method', '');
  const from = getParam('from', '');
  const to = getParam('to', '');
  const search = getParam('search', '');

  const {
    data: transactionList,
    isFetching,
    isLoading,
  } = useGetAllTransactionsQuery(
    {
      page,
      size,
      paymentMethod,
      paymentStatus,
      search,
      from,
      to,
    },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (transactionList?.response) {
      const totalDataCount = transactionList?.response?.total;

      dispatch(updateTotalDataCount(totalDataCount));
    }
  }, [dispatch, transactionList?.response]);

  const handleResetClick = () => {
    deleteSearchParams(['search', 'category', 'status', 'from', 'to', 'payment-status', 'payment-method']);
  };

  const filters = [paymentStatus, paymentMethod, from, to, search].some((value) => value !== '');

  return (
    <>
      {(transactionList && transactionList.response.data.length > 0) || filters || isLoading || isFetching ? (
        <>
          <TableMenuComponents
            selectList={[
              {
                title: 'Payment Status',
                className: 'custom-select w-165 m-l-12 h-44 table-menu',
                options: [
                  { label: 'Completed', value: TRANSACTION_STATUS.COMPLETED },
                  { label: 'Pending', value: TRANSACTION_STATUS.PENDING },
                  { label: 'Failed', value: TRANSACTION_STATUS.FAILED },
                ],
                onChange: (value) => {
                  updateSearchParams({ 'payment-status': value.join(',') });
                },
              },
              {
                title: 'Payment Method',
                className: 'custom-select w-165 m-l-12 h-44 table-menu',
                options: [
                  { label: 'Stripe', value: TRANSACTION_METHOD.STRIPE },
                  { label: 'Wallet', value: TRANSACTION_METHOD.WALLET },
                ],
                onChange: (value) => {
                  updateSearchParams({ 'payment-method': value.join(',') });
                },
              },
            ]}
            datePickerOptions={{
              enable: true,
              onChange: (date) => {
                updateSearchParams({
                  from: date ? toLocalISOString(date[0]) : '',
                  to: date ? toLocalISOString(date[1]) : '',
                });
              },
            }}
            onSearchValueChange={(value) => {
              updateSearchParams({ search: value });
            }}
            onResetClick={handleResetClick}
            defaultSearchValue={search}
          />

          <div className="m-x-20 m-y-20">
            <TableComponent
              data={transactionList?.response?.data as unknown as Record<string, unknown>[]}
              columns={transactionListColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
              rowKey={'_id'}
              loading={isFetching || isLoading}
              className="no-pointer-row"
            />
            <StyledModal
              type="transactions"
              actionType={'approve' as ActionType}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              name={name}
              handleCancel={() => setIsOpen(false)}
              handleConfirm={() => setIsOpen(false)}
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
