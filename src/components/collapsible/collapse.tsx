'use client';

import { Collapse } from 'antd';
import {
  ChartNoAxesCombined,
  ChevronDown,
  CircleCheck,
  CircleX,
  EllipsisVertical,
  Eye,
  FileX2,
  PackageX,
  Plus,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ASSET_STATUS } from '@/helpers/constants/asset.status';
import { STATUS } from '@helpers/constants/document-status';

import { Document } from '../asset-details/interface';
import PriceChartComponent from '../asset-details/price-history-graph';
import DropdownComponent from '../dropdown/dropdown';

import { CollapseProps } from './interface';

import './_custom_collapse.scss';

const StyledCollapse = ({
  assetData,
  accordionSections,
  handlePreview,
  handleRemoveApproval,
  setSelectedDocument,
}: CollapseProps) => {
  const router = useRouter();
  const getMenuItems = (doc: Document, status: ASSET_STATUS) => {
    const baseMenuItems = [
      {
        key: 'preview',
        label: 'Preview',
        icon: <Eye />,
      },
    ];

    if (doc.status === STATUS.APPROVED && status !== ASSET_STATUS.LIVE) {
      baseMenuItems.push({
        key: 'remove-approval',
        label: 'Remove Approval',
        icon: <PackageX />,
      });
    }

    return baseMenuItems;
  };

  const items = [
    {
      key: 'price',
      label: 'Asset Value Over Time',
      children: (
        <div>
          {assetData.priceHistory && assetData.priceHistory.length > 0 ? (
            <PriceChartComponent priceHistory={assetData.priceHistory} />
          ) : (
            <div className="border-primary-1 radius-6 p-x-24 p-y-24 gap-6 d-flex flex-column align-center">
              <div className="p-x-10 p-y-10 radius-100 bg-active h-44 w-44">
                <ChartNoAxesCombined className="f-16-20-500-blue-icon" />
              </div>
              <p className="f-14-22-400-tertiary">No Data Available for Chart</p>
              <button
                onClick={() => router.push(`/asset-edit/${assetData.assetId}`)}
                className="f-14-20-500-primary bg-white border-primary-1 p-x-16 p-y-8 d-flex align-center radius-6 gap-2 cursor-pointer"
              >
                <Plus /> Add Data
              </button>
            </div>
          )}
        </div>
      ),
    },
    ...accordionSections.map((section) => {
      const documentsForSection = assetData?.documents?.filter((doc) => doc.type === section.key);

      return {
        key: section.key,
        label: section.label,
        children:
          documentsForSection && documentsForSection.length > 0 ? (
            <div className="documents-grid">
              {documentsForSection.map((doc, idx) => (
                <div key={idx} className="document-item">
                  {doc.status !== STATUS.PENDING && (
                    <div>
                      {doc.status === STATUS.APPROVED ? (
                        <CircleCheck className="f-14-22-500-success" />
                      ) : (
                        <CircleX className="f-14-22-500-failure" />
                      )}
                    </div>
                  )}
                  {doc.documentUrl && /\.(jpg|jpeg|png|svg)$/i.test(doc.documentUrl) ? (
                    <Image
                      src={doc.documentUrl}
                      alt={doc.type}
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => handlePreview(doc)}
                    />
                  ) : (
                    <Image
                      src="/pdf.svg"
                      alt={doc.type}
                      width={40}
                      height={40}
                      className="cursor-pointer"
                      onClick={() => handlePreview(doc)}
                    />
                  )}
                  <span className="f-14-16-400-secondary">
                    {doc.documentName && doc.documentName.length > 20
                      ? `${doc.documentName.slice(0, 12)}...${doc.documentName.slice(-3)}`
                      : doc.documentName || doc.type}
                  </span>
                  <DropdownComponent
                    label={
                      <EllipsisVertical
                        onClick={() => setSelectedDocument(doc)}
                        className="cursor-pointer f-14-22-500-tertiary"
                      />
                    }
                    menuItems={getMenuItems(doc, assetData.status)}
                    dropdownPlacement="bottomLeft"
                    handleClick={(params) => {
                      if (params.key === 'preview') {
                        handlePreview(doc);
                      } else if (params.key === 'remove-approval') {
                        handleRemoveApproval(doc);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-documents">
              <div className="p-x-10 p-y-10 bg-no-document h-40 w-40 radius-100">
                <FileX2 className="p-0 m-0" />
              </div>
              <p>No documents available</p>
            </div>
          ),
      };
    }),
  ];

  return (
    <Collapse
      expandIcon={({ isActive }) => <ChevronDown className={`collapse-icon ${isActive ? 'active' : ''}`} />}
      className="custom-collapse"
      items={items}
      expandIconPosition="end"
    />
  );
};

export default StyledCollapse;
