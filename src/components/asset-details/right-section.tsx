'use client';

import { Avatar, Divider } from 'antd';
import { CalendarDays, ChevronDown, Eye, HandCoins, Heart, Info, Minus, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { extractText } from '@/helpers/functions';
import RenderSlateContent from '@/helpers/slate-content';
import { useUsdToPolConverter } from '@/hooks/useUsdToPol';
import { getMenuItems, getStatusClass } from '@helpers/asset-utils';
import { ASSET_STATUS, ASSSET_ACTION } from '@helpers/constants/asset.status';
import { accordionSections } from '@helpers/constants/constants';
import { formatDate } from '@helpers/constants/services/date-formatter';
import { formatNumber } from '@helpers/constants/services/number-formatter';
import { capitalizeFistLetter } from '@helpers/services/text-formatter';
import { useModals } from '@hooks/use-modals';

import StyledCollapse from '../collapsible/collapse';
import DropdownComponent from '../dropdown/dropdown';
import TokensModal from '../modal/tokens-modal';

import AdminTokenDetails from './admin-token-details';
import { RightSectionProps } from './interface';
import { statuses } from './left-section';
import TokenDetails from './token-details';

const showButtons = [ASSET_STATUS.REJECTED, ASSET_STATUS.SOLD];

const RightSection = ({
  assetData,
  isMenuOpen,
  setIsMenuOpen,
  openModal,
  setIsModalPreview,
  setSelectedDocument,
  setPreviewModalType,
  selectedDocument,
}: RightSectionProps) => {
  const router = useRouter();
  const { convertUsdToPol } = useUsdToPolConverter();

  const [tokens, setTokens] = useState<number>(0);
  const [type, setType] = useState<ASSSET_ACTION>(ASSSET_ACTION.MINT);
  const [price, setPrice] = useState<number>(Number(assetData.price));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    mintAndListAsset,
    deleteAsset,
    delistAsset,
    handleIssueTokens,
    handlePreview,
    handleRemoveApproval,
    holdAsset,
    listAsset,
    rejectAsset,
  } = useModals({
    openModal,
    setIsModalPreview,
    setSelectedDocument,
    setPreviewModalType,
  });

  const handleEditAsset = () => {
    router.push(`/asset-edit/${assetData.assetId}`);
  };

  const fullText = extractText(JSON.parse(assetData.description));
  const isLongText = fullText.length > 350;
  const displayedContent = JSON.parse(assetData.description);

  const rejectionTitle = () =>
    assetData.status === ASSET_STATUS.REJECTED
      ? 'Rejection'
      : assetData.status === ASSET_STATUS.HOLD
        ? 'Hold'
        : 'Delist';

  const updateAsset = () => {
    setType(ASSSET_ACTION.UPDATE);
    setIsModalOpen(true);
  };

  return (
    <div className="right-section">
      <div className="info">
        <div className="status-section">
          <div className="d-flex align-center gap-3">
            <div className="badge d-flex align-center gap-2">{assetData.category.category}</div>
            <div className="d-flex align-center gap-1">
              <span className={`status-dot h-14 w-14 radius-100 ${getStatusClass(assetData.status)}`} />
              {assetData.status}
            </div>
          </div>
          <div className="d-flex align-center gap-4 justify-space-between">
            <span className="d-flex align-center gap-2">
              <Eye className="img-16" />
              {formatNumber(assetData.viewsCount)} views
            </span>
            <span className="d-flex align-center gap-2">
              <Heart className="img-16" />
              {formatNumber(assetData.likesCount)}
            </span>
          </div>
        </div>
        <p className="f-16-20-400-secondary">#{assetData.assetId}</p>
        <h1 className="title">{assetData.name}</h1>
        <div className="description">
          <div className="f-14-22-400-tertiary">
            <RenderSlateContent content={displayedContent} />
          </div>
        </div>
      </div>

      <div className="price-section">
        <div className="price">
          ${assetData.price}
          <div className="currency">USD</div>
        </div>
        <Minus className="separator" />
        <div className="price">
          {/*USD to Etherium Cobersion */}
          {convertUsdToPol(assetData.price)}
          <span className="currency">POL</span>
        </div>
      </div>
      {assetData.status === ASSET_STATUS.GOING_LIVE && assetData.listedDate && (
        <div className="p-x-16 p-y-14 d-flex gap-2 radius-8 bg-active">
          <div className="d-flex align-center justify-space-between width-100">
            <p className="d-flex align-center gap-3">
              <CalendarDays />
              Asset will be listed on
              <span className="f-14-20-600-blue-icon">{new Date(assetData.listedDate).toLocaleDateString()}</span>
            </p>
            <button className="main-button cursor-pointer" onClick={mintAndListAsset}>
              <Pencil />
            </button>
          </div>
        </div>
      )}
      <div className="d-flex gap-4 align-center">
        {/* {!showButtons.includes(assetData.status) ? ( */}
        {assetData.status === ASSET_STATUS.NEWLY_ADDED ? (
          <DropdownComponent
            label={
              <div
                className="d-flex align-center p-y-8 p-x-16 gap-2 radius-6 d-flex align-center justify-center border-main-1 bg-white f-14-20-500-active  cursor-pointer position-relative"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                Manage Asset
                <ChevronDown
                  className={`img-16 ${isMenuOpen ? 'rotate' : ''}`}
                  style={{ position: 'absolute', right: '10px' }}
                />
              </div>
            }
            menuItems={getMenuItems(assetData.status, assetData.soldTokens, assetData?.sellerId?.status)}
            dropdownPlacement="bottom"
            handleClick={(params) => {
              switch (params.key) {
                case 'edit-asset':
                  handleEditAsset();
                  break;
                case 'hold-asset':
                  holdAsset();
                  break;
                case 'reject-asset':
                  rejectAsset();
                  break;
                case 'delist-asset':
                  delistAsset();
                  break;
                case 'delete-asset':
                  deleteAsset();
                  break;
                case 'list-asset':
                  listAsset();
                  break;
                // case 'update-asset':
                //   updateAsset();
                //   break;
              }
            }}
            className="width-50"
          />
        ) : // <>
        //   {assetData.status === ASSET_STATUS.REJECTED ? (
        //     <button
        //       className="p-y-8 p-x-16 gap-2 radius-6 d-flex align-center justify-center border-red-1 bg-white f-14-20-500-red width-50 cursor-pointer"
        //       onClick={deleteAsset}
        //     >
        //       <Trash2 className="h-16 w-16" />
        //       Delete Asset
        //     </button>
        //   ) : (
        //     <button
        //       className="p-y-8 p-x-16 gap-2 radius-6 d-flex align-center justify-center border-main-1 bg-white f-14-20-500-active width-50 cursor-pointer"
        //       onClick={delistAsset}
        //     >
        //       <CircleX className="h-16 w-16" />
        //       Delist Asset
        //     </button>
        //   )}
        // </>
        null}
        {statuses.includes(assetData.status) && assetData.tokens < 10 && (
          // <>
          //   {assetData.tokens > 1 ? (
          //     <DropdownComponent
          //       label={
          //         <button
          //           className={`d-flex align-center p-y-8 p-x-16 gap-2 radius-6 d-flex align-center justify-center f-15-20-500-brand-white bg-brand-color border-main-1 cursor-pointer`}
          //           onClick={() => setIsMenuOpen((prev) => !prev)}
          //         >
          //           Manage Tokens
          //           <ChevronDown className={`img-16 icon-white ${isMenuOpen ? 'rotate' : ''} chevron `} />
          //         </button>
          //       }
          //       menuItems={[
          //         {
          //           key: ASSSET_ACTION.MINT,
          //           label: 'Mint Tokens',
          //           icon: <HandCoins size={20} />,
          //         },
          //         {
          //           key: ASSSET_ACTION.BURN,
          //           label: 'Burn Tokens',
          //           icon: <Flame size={20} />,
          //         },
          //       ]}
          //       dropdownPlacement="bottom"
          //       handleClick={(params) => {
          //         setType(params.key as ASSSET_ACTION);
          //         setIsModalOpen(true);
          //         //  handleBuyToken();
          //       }}
          //       className="width-50 bg-brand-blue p-x-16 p-y-8"
          //     />
          //   ) : (
          <button
            className="bg-token p-y-8 p-x-16 gap-2 radius-6 d-flex align-center border-main-1 f-14-20-500-logo width-50 justify-center cursor-pointer"
            onClick={handleIssueTokens}
          >
            <HandCoins className="h-16 w-16" />
            Issue Tokens
          </button>
          //   )}
          // </>
        )}
      </div>
      {assetData.isAdminAsset ? (
        <AdminTokenDetails
          price={assetData.price}
          listings={assetData.listings}
          soldTokens={assetData.soldTokens}
          tokens={assetData.tokens}
          isAdminAsset={assetData.isAdminAsset}
          ownershipDetails={assetData.assetOwners}
          listingActivity={assetData.listingActivity}
        />
      ) : (
        <TokenDetails asset={assetData} />
      )}

      {assetData.adminRemarks && (
        <div className="d-flex flex-column gap-3">
          <h1 className="f-14-20-600-primary">Reason for Asset {rejectionTitle()}</h1>
          {/*<div className="p-x-12 p-y-12 border-primary-1 radius-10 f-14-20-500-primary">{assetData.adminRemarks}</div>*/}
          <div
            className={`d-flex align-center gap-2 p-x-12 p-y-12 radius-4 ${assetData.status === ASSET_STATUS.HOLD ? 'bg-hold-secondary' : 'bg-error-secondary'}`}
          >
            <div className="h-20 w-20 d-flex align-center">
              <Info
                size={20}
                className={`${assetData.status === ASSET_STATUS.HOLD ? 'f-14-20-400-hold' : 'f-14-20-400-error-s'}`}
              />
            </div>
            <p>{assetData.adminRemarks}</p>
          </div>
        </div>
      )}

      <StyledCollapse
        assetData={assetData}
        setSelectedDocument={setSelectedDocument}
        accordionSections={accordionSections}
        selectedDocument={selectedDocument}
        handlePreview={handlePreview}
        handleRemoveApproval={handleRemoveApproval}
      />
      <Divider plain />
      <div className="location-section">
        <h3>Asset Location</h3>
        <div className="location radius-8">
          <div className="radius-8">
            <iframe
              src={`https://www.google.com/maps?q=${assetData.state},+${assetData.country},+${assetData.pincode}&output=embed`}
              className="w-100 h-200"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {assetData?.sellerId && (
        <div className="seller-section">
          <h3>Sold by</h3>
          <div className="seller-info">
            <div className="avatar">
              <Avatar src="/seller.jpeg" alt="seller-image" className="h-40 w-40" />
            </div>
            <div className="seller-details">
              <p className="seller-name">
                {capitalizeFistLetter(assetData.sellerId?.firstName ?? 'John')} &nbsp;
                {capitalizeFistLetter(assetData.sellerId?.lastName ?? 'Doe')}
              </p>
              <p className="seller-joined">
                Joined &nbsp;
                {formatDate(assetData?.createdAt ?? '25-03-2023')}
              </p>
            </div>
          </div>
        </div>
      )}
      <TokensModal
        type={type}
        availableTokens={assetData?.tokens - assetData?.soldTokens}
        currentValue={assetData.price}
        handleCancel={() => {
          setIsModalOpen(false);
          setTokens(0);
          setPrice(assetData.price);
        }}
        handleConfirm={() => {
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
        issuedTokens={assetData.tokens}
        price={price}
        setPrice={setPrice}
        tokens={tokens}
        setTokens={setTokens}
        assetData={assetData}
      />
    </div>
  );
};

export default RightSection;
