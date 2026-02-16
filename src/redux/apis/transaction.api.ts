import { GetTransactionParams, TransactionsApiResponse } from '../interfaces/transaction.interface';
import { API_METHODS, END_POINTS } from '../utils/constants';

import { baseApi } from '.';

export const transactionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllTransactions: builder.query<TransactionsApiResponse, GetTransactionParams>({
      query: ({ paymentStatus = '', paymentMethod = '', search = '', from = '', to = '', page = 1, size = 10 }) => {
        let url = END_POINTS.getTxsList(page, size, search);

        if (paymentStatus.trim()) url = `${url}&paymentStatus=${paymentStatus}`;
        if (paymentMethod.trim()) url = `${url}&paymentMethod=${paymentMethod}`;
        if (from && to) url = `${url}&from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}`;

        return { url };
      },
    }),
    updatePaymentAsRefunded: builder.mutation<
      string,
      { userId: string; checkoutSessionId: string; refundReason: string }
    >({
      query: ({ userId, checkoutSessionId, refundReason }) => ({
        url: END_POINTS.updatePaymentAsRefunded(userId),
        method: API_METHODS.PATCH,
        body: { checkoutSessionId, refundReason },
      }),
    }),
  }),
});

export const { useGetAllTransactionsQuery } = transactionApi;
