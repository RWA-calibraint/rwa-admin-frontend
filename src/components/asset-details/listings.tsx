import React from 'react';

import { ListingInterface } from './interface';
import NoData from './no-data';

const Listing = ({ listings }: { listings: ListingInterface[] }) => {
  const headers = ['Token Price', 'Tokens', 'From'];

  return (
    <div>
      {listings && listings.length > 0 ? (
        <>
          <div className={`d-grid grid-cols-3 align-center p-x-4`}>
            {headers.map((header, idx) => (
              <p key={idx} className={`f-14-16-500-tertiary p-x-16 p-y-14`}>
                {header}
              </p>
            ))}
          </div>
          <div className="d-grid grid-cols-3 align-center p-x-4">
            {listings.map((item, idx) => (
              <React.Fragment key={idx}>
                <p className={`p-x-16 p-y-20 f-14-16-500-secondary`}>${item.tokenPrice.toFixed(4)}</p>
                <p className={`p-x-16 p-y-20 f-14-16-500-secondary`}>{item.tokens}</p>
                <p className={`p-x-16 p-y-20 f-14-16-500-secondary`}>{item.sellerId._id}</p>
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <NoData description="No Listings Yet" />
      )}
    </div>
  );
};

export default Listing;
