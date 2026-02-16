import { List } from 'lucide-react';
import React from 'react';
interface NodataProps {
  description: string;
}
const NoData = ({ description }: NodataProps) => {
  return (
    <div className="d-flex flex-column align-center justify-center gap-4">
      <div className="bg-brand p-10 radius-100 d-flex align-center justify-center">
        <List className="icon-brand-secondary" size={20} />
      </div>
      <p className="f-14-16-400-tertiary m-b-20">{description}</p>
    </div>
  );
};

export default NoData;
