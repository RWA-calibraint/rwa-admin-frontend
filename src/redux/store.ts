import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux';

import { baseApi } from './apis';
import { authApi } from './apis/auth.api';
import { assetsReducer } from './slices/assets.slice';
import { AuthReducer } from './slices/auth.slice';
import { PaginationReducer } from './slices/pagination.slice';
import { TransactionsReducer } from './slices/transactions.slice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  auth: AuthReducer,
  asset: assetsReducer,
  transactions: TransactionsReducer,
  pagination: PaginationReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
