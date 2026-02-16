import React from 'react';

import { AssetData } from './interface';
interface TokenDetailsProps {
  asset: AssetData;
}

const TokenDetails = ({ asset }: TokenDetailsProps) => {
  return (
    <div className="border-primary-1 radius-8 p-x-16 p-y-16 d-flex flex-column gap-5">
      <h1 className="f-16-20-600-primary">Token Details</h1>
      {asset.tokens && (
        <div className="d-flex flex-column gap-4 f-14-20-400-secondary">
          <div className="d-flex align-center justify-space-between">
            <p>No of tokens</p>
            <p>{asset.tokens}</p>
          </div>
          <div className="d-flex align-center justify-space-between">
            <p>Price Per Token ($USD)</p>
            <p>${asset.price / asset.tokens}</p>
          </div>
          <div className="d-flex align-center justify-space-between">
            <p>Seller&apos;s Listed Price</p>
            <p>${asset.price}</p>
          </div>
          <div className="d-flex align-center justify-space-between">
            <p>Available tokens</p>
            <p>{asset.tokens - asset.soldTokens}</p>
          </div>
          <div className="d-flex align-center justify-space-between">
            <p>Sold tokens</p>
            <p>{asset.soldTokens ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenDetails;
