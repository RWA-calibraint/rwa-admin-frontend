'use client';

import { useParams } from 'next/navigation';

import ErrorPage from '@/app/not-found';
import AssetDetails from '@components/asset-details/asset-details';
import { AssetData } from '@components/asset-details/interface';
import AssetDetailsSkeleton from '@components/skeleton/asset-details.skeleton';
import { useGetAssetDetailQuery } from '@redux/apis/assets.api';

export default function Page() {
  const params = useParams();
  const assetId = params.assetId;

  const {
    data: assetDataFromAPi,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useGetAssetDetailQuery(String(assetId), { refetchOnMountOrArgChange: true });

  if (isFetching || isLoading) return <AssetDetailsSkeleton />;

  if (isError) return <ErrorPage />;

  return <AssetDetails assetData={assetDataFromAPi?.response as AssetData} refetch={refetch} />;
}
