'use client';

import { Button, Image as AntImage } from 'antd';
import { Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { ASSET_STATUS } from '@helpers/constants/asset.status';

import { LeftSectionProps } from './interface';

export const statuses = [
  ASSET_STATUS.NEWLY_ADDED,
  ASSET_STATUS.HOLD,
  ASSET_STATUS.RE_SUBMITTED,
  ASSET_STATUS.GOING_LIVE,
  ASSET_STATUS.LIVE,
];
// const requiredDocs = [
//    DOCUMENT_TYPE.CERTIFICATES,
//    DOCUMENT_TYPE.LEGAL_HEIR_CERTIFICATES,
//    DOCUMENT_TYPE.PROOF_OF_OWNERSHIP,
// ];

const LeftSection = ({
  assetData,
  images,
  documents,
  tokens,
  status,
  selectedImage,
  setSelectedImage,
  approveAsset,
  listAsset,
}: LeftSectionProps) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  const [index, setIndex] = useState({
    start: 0,
    end: 4,
  });

  useEffect(() => {
    // const requiredDocuments = documents.filter((doc) => requiredDocs.includes(doc.type));
    // const canApproveAsset = requiredDocuments.every((doc) => doc.status === STATUS.APPROVED);

    const issuedTokens = tokens >= 10;

    if (assetData.verificationDate) {
      setDisabled(!assetData?.sellerId?.walletAddress);
    } else {
      setDisabled(!issuedTokens);
    }
  }, [tokens, assetData?.sellerId?.walletAddress, assetData?.verificationDate]);

  const handleShowNextImages = () => {
    if (index.end < images.length) {
      setIndex((prev) => ({
        start: prev.start + 1,
        end: prev.end + 1,
      }));
    }
  };

  const handleShowPreviousImages = () => {
    if (index.start > 0) {
      setIndex((prev) => ({
        start: prev.start - 1,
        end: prev.end - 1,
      }));
    }
  };

  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];

  return (
    <div className="left-section">
      <div className="images-section">
        <div className="thumbnails">
          {images.slice(index.start, index.end).map((thumb, i) => {
            const isVideo = videoExtensions.some((ext) => thumb.toLowerCase().endsWith(ext));

            return (
              <div
                key={i}
                className={`${thumb === selectedImage ? 'border-selected-image-3' : ''} thumbnail-image radius-6 cursor-pointer img-fit-contain width-100`}
                style={{ borderRadius: '6px' }}
              >
                <div className="d-flex align-center justify-center height-100">
                  {isVideo ? (
                    <video
                      onClick={() => setSelectedImage(thumb)}
                      src={thumb}
                      width={86}
                      height={86}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        overflow: 'hidden',
                        maxHeight: '100px',
                      }}
                    />
                  ) : (
                    <Image
                      onClick={() => setSelectedImage(thumb)}
                      src={thumb}
                      alt={`Thumbnail ${i + 1}`}
                      width={86}
                      height={86}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        overflow: 'hidden',
                        maxHeight: '100px',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {/*Images navigation menu*/}
          {index.end < images.length && (
            <button
              style={{
                position: 'absolute',
                bottom: '0',
                width: '100%',
                height: '7%',
              }}
              className="bg-secondary cursor-pointer border-primary-1 radius-4"
              onClick={handleShowNextImages}
              aria-label="Show next images"
            >
              <ChevronDown size={20} />
            </button>
          )}
          {index.start > 0 && (
            <button
              style={{
                position: 'absolute',
                top: '0',
                width: '100%',
                height: '7%',
              }}
              className="bg-secondary cursor-pointer border-primary-1 radius-4"
              onClick={handleShowPreviousImages}
              aria-label="Show previous images"
            >
              <ChevronUp size={20} />
            </button>
          )}
        </div>
        {selectedImage &&
          (videoExtensions.some((ext) => selectedImage.toLowerCase().endsWith(ext)) ? (
            <video
              src={selectedImage}
              controls
              className="main-image width-100"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <AntImage
              src={selectedImage}
              alt={`${selectedImage}-image`}
              width={'100%'}
              height={'100%'}
              className="main-image width-80"
            />
          ))}
      </div>

      {((statuses.includes(status) && status !== ASSET_STATUS.LIVE && status !== ASSET_STATUS.GOING_LIVE) ||
        !assetData.contractTokenId ||
        !assetData.ContractListingId) && (
        <div className="action-buttons" key={status}>
          {assetData.verificationDate && (!assetData.ContractListingId || !assetData.contractTokenId) ? (
            <>
              <Button
                type="primary"
                className="approve-button"
                disabled={disabled}
                onClick={listAsset}
                icon={<Check className="button-icon" />}
              >
                Mint and List Asset
              </Button>
              {disabled && (
                <div className="d-flex align-center justify-flex-start gap-3 radius-4 bg-active width-100 p-x-12 p-y-12">
                  <Info className="f-14-20-500-blue-icon" />
                  User wallet not connected
                </div>
              )}
            </>
          ) : (
            <>
              <Button
                type="primary"
                className="approve-button"
                disabled={disabled}
                onClick={approveAsset}
                icon={<Check className="button-icon" />}
              >
                Approve Asset
              </Button>
              {disabled && (
                <div className="d-flex align-center justify-flex-start gap-3 radius-4 bg-active width-100 p-x-12 p-y-12">
                  <Info className="f-14-20-500-blue-icon" />
                  To approve asset, verify documents and issue tokens
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LeftSection;
