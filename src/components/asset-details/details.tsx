import React from 'react';

import NoData from './no-data';

interface DetailsProps {
  tokens: number;
  price: number;
  soldTokens: number;
}

const Details = ({ tokens, price, soldTokens }: DetailsProps) => {
  const details = [
    {
      key: 'Contract Address',
      value: '0xc259...787c',
    },
    {
      key: 'Token ID',
      value: '98643',
    },
    {
      key: 'Token Standard',
      value: 'ERC1155',
    },
    {
      key: 'No of tokens',
      value: `${tokens}`,
    },
    {
      key: 'Price per token $(USD)',
      value: `${(price / tokens).toFixed(4)}`,
    },
    {
      key: 'Available tokens',
      value: `${tokens - soldTokens}`,
    },
    {
      key: 'Sold tokens',
      value: `${soldTokens}`,
    },
    {
      key: 'Token Value',
      value: `${price}`,
    },
  ];

  return (
    <div className="d-flex flex-column gap-4 p-16">
      {details.length > 0 ? (
        details.map((item) => (
          <div key={item.key} className="d-flex align-center justify-space-between">
            <p className="f-14-16-400-primary">{item.key}</p>
            <p
              className={`${item.key === 'Contract Address' || item.key === 'Token ID' ? 'f-14-16-400-blue-icon' : 'f-14-16-400-primary'}`}
            >
              {item.value}
            </p>
          </div>
        ))
      ) : (
        <NoData description={'No Activity Yet'} />
      )}
    </div>
  );
};

export default Details;
