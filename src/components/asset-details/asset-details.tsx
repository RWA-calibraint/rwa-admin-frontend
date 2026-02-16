'use client';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { getStatus } from '@helpers/asset-utils';
import { ASSET_MODAL_TYPE, ASSET_STATUS } from '@helpers/constants/asset.status';
import { STATUS } from '@helpers/constants/document-status';
import { DOC_TYPE, DOCUMENT_MODAL_TYPE } from '@helpers/constants/document-type';
import { getSuccessMessage } from '@helpers/constants/services/get-success-message';
import { SUCCESS_MESSAGES } from '@helpers/constants/succes-messages';
import { showErrorToast, showSuccessToast } from '@helpers/constants/toast.notification';
import { useModals } from '@hooks/use-modals';
import {
  useDeleteAssetMutation,
  useUpdateTokensMutation,
  useVerifyAssetMutation,
  useVerifyDocumentMutation,
  useApproveAssetMutation,
} from '@redux/apis/assets.api';
import { VerifyAsset } from '@redux/interfaces/assets.interface';

import { ActionType, DocType, DocumentPayload } from '../modal/interface';
import StyledModal from '../modal/modal';
import ModalPreview from '../modal/modal-preview';

import { AssetDetailProps, Document } from './interface';
import LeftSection from './left-section';
import RightSection from './right-section';

const AssetDetailsPage = ({ assetData, refetch }: AssetDetailProps) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | undefined | null>(assetData?.images[0]);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalPreview, setIsModalPreview] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'assets',
    actionType: 'approve',
    hasSuspensionPeriod: false,
    remarks: false,
    issueTokens: false,
    name: '',
  });

  const [previewModalType, setPreviewModalType] = useState<DocType>(DOC_TYPE.DOCUMENT);

  const openModal = useCallback(
    (type: string, actionType: ActionType, issueTokens?: boolean) => {
      setModalConfig({
        type,
        issueTokens: issueTokens ?? false,
        actionType,
        hasSuspensionPeriod: false,
        remarks:
          actionType === ASSET_MODAL_TYPE.HOLD ||
          actionType === ASSET_MODAL_TYPE.REJECT ||
          actionType === ASSET_MODAL_TYPE.DELETE ||
          actionType === ASSET_MODAL_TYPE.DELIST,
        name: selectedDocument?.documentUrl ?? '',
      });

      setIsOpen(true);
    },
    [selectedDocument],
  );

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [verifyAsset, { isLoading: verifyLoading }] = useVerifyAssetMutation();
  const [verifyDocument, { isLoading: docLoaing }] = useVerifyDocumentMutation();
  const [updateTokens, { isLoading: updateLoading }] = useUpdateTokensMutation();
  const [deleteAsset, { isLoading: deleteloading }] = useDeleteAssetMutation();
  const [approveAsset, { isLoading: approveLoading }] = useApproveAssetMutation();
  const [remarksText, setRemarksText] = useState<string>(assetData.adminRemarks ?? '');
  const [tokens, setTokens] = useState<string>(String(assetData.tokens) || '');
  const [listedDate, setListedDate] = useState<Date | null>(new Date(assetData.listedDate));
  const [isfeaturedAsset, setIsFeaturedAsset] = useState<boolean>(false);
  const { mintAndListAsset, approveDoc, rejectDoc } = useModals({
    openModal,
    setIsModalPreview,
    setSelectedDocument,
    setPreviewModalType,
  });

  const payload: VerifyAsset = useMemo(() => {
    return {
      bodyData: {
        assetId: assetData.assetId,
        status: getStatus(modalConfig.actionType as ASSET_MODAL_TYPE),
        remarks: '',
      },
    };
  }, [assetData.assetId, modalConfig.actionType]);

  if (modalConfig.type === 'assets') {
    switch (modalConfig.actionType) {
      case ASSET_MODAL_TYPE.TOKENS:
        payload.bodyData.tokens = Number(tokens);
        break;
      case ASSET_MODAL_TYPE.REJECT:
      case ASSET_MODAL_TYPE.HOLD:
      case ASSET_MODAL_TYPE.DELETE:
      case ASSET_MODAL_TYPE.DELIST:
        payload.bodyData.remarks = remarksText;
        break;
      case ASSET_MODAL_TYPE.APPROVE:
        payload.bodyData.listedDate = listedDate;
        payload.bodyData.isfeaturedAsset = isfeaturedAsset;
        break;
    }
  }

  const docPayload: DocumentPayload = useMemo(() => {
    return {
      documentId: selectedDocument?._id || '',
      status: STATUS.PENDING,
      remarks: '',
    };
  }, [selectedDocument?._id]);

  if (modalConfig.type === 'documents') {
    switch (modalConfig.actionType) {
      case DOCUMENT_MODAL_TYPE.APPROVE:
        docPayload.status = STATUS.APPROVED;
        docPayload.isVerified = true;
        break;
      case DOCUMENT_MODAL_TYPE.REJECT:
        docPayload.status = STATUS.REJECTED;
        docPayload.remarks = remarksText;
        docPayload.isVerified = false;
        break;
      case DOCUMENT_MODAL_TYPE.REMOVE:
        docPayload.status = STATUS.PENDING;
        docPayload.remarks = remarksText;
        docPayload.isVerified = false;
        break;
    }
  }

  const handleUpdateTokens = useCallback(async () => {
    try {
      await updateTokens({
        assetId: assetData.assetId,
        tokens: tokens,
      });
      showSuccessToast(SUCCESS_MESSAGES.TOKENS_ISSUED);
      setIsOpen(false);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failure';

      showErrorToast(errorMessage);
    }
  }, [assetData.assetId, refetch, tokens, updateTokens]);

  const handleAsset = useCallback(async () => {
    try {
      await verifyAsset(payload).unwrap();
      showSuccessToast(String(getSuccessMessage(modalConfig.actionType as ActionType)));
      setIsOpen(false);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failure';

      showErrorToast(errorMessage);
    }
  }, [payload, refetch, verifyAsset, modalConfig.actionType]);

  const handleDoc = useCallback(async () => {
    try {
      await verifyDocument(docPayload);
      showSuccessToast(String(getSuccessMessage(modalConfig.actionType as ActionType)));
      setIsOpen(false);
      setSelectedDocument(null);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failure';

      showErrorToast(errorMessage);
    }
  }, [docPayload, refetch, verifyDocument, modalConfig.actionType]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteAsset(assetData.assetId);
      showSuccessToast(SUCCESS_MESSAGES.ASSET_DELETED);
      refetch();
      router.back();
      setIsOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failure';

      showErrorToast(errorMessage);
    }
  }, [assetData.assetId, deleteAsset, router, refetch]);

  const handleApprove = useCallback(async () => {
    try {
      await approveAsset(assetData.assetId);
      showSuccessToast(SUCCESS_MESSAGES.ASSET_APPROVED);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failure';

      showErrorToast(errorMessage);
    }
  }, [assetData.assetId, approveAsset, refetch]);

  const handleClosePreview = () => {
    setIsModalPreview(false);
    setSelectedDocument(null);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setListedDate(null);
  };

  const handleConfirm = useCallback(() => {
    if (modalConfig.type === 'assets') {
      if (modalConfig.actionType === ASSET_MODAL_TYPE.TOKENS) {
        return handleUpdateTokens();
      } else if (modalConfig.actionType === ASSET_MODAL_TYPE.DELETE) {
        return handleDelete();
      } else {
        return handleAsset();
      }
    } else {
      return handleDoc();
    }
  }, [modalConfig.type, modalConfig.actionType, handleUpdateTokens, handleDelete, handleAsset, handleDoc]);
  const handleBack = () => {
    const statusCategoryMap: Record<ASSET_STATUS, string> = {
      [ASSET_STATUS.NEWLY_ADDED]: 'pending',
      [ASSET_STATUS.SUBMITTED]: 'pending',
      [ASSET_STATUS.RE_SUBMITTED]: 'pending',
      [ASSET_STATUS.GOING_LIVE]: 'approved',
      [ASSET_STATUS.LIVE]: 'approved',
      [ASSET_STATUS.SOLD]: 'approved',
      [ASSET_STATUS.HOLD]: 'approved',
      [ASSET_STATUS.DELISTED]: 'approved',
      [ASSET_STATUS.REJECTED]: 'rejected',
      [ASSET_STATUS.DELETED]: 'rejected',
    };

    const routeCategory = statusCategoryMap[assetData?.status as ASSET_STATUS] || 'pending';

    router.push(`/asset/${routeCategory}-assets`);
  };

  const isLoading = useMemo(
    () => updateLoading || verifyLoading || docLoaing || deleteloading || approveLoading,
    [updateLoading, verifyLoading, docLoaing, deleteloading, approveLoading],
  );

  return (
    <div className="main-container">
      <button className="back-button" onClick={handleBack}>
        <ChevronLeft className="icon" />
        Back
      </button>
      <div className="container">
        <LeftSection
          assetData={assetData}
          listAsset={mintAndListAsset}
          approveAsset={handleApprove}
          images={assetData.images}
          documents={assetData.documents}
          tokens={assetData.tokens}
          status={assetData.status}
          selectedDocument={selectedDocument}
          selectedImage={selectedImage}
          setIsModalPreview={setIsModalPreview}
          setPreviewModalType={setPreviewModalType}
          setSelectedImage={setSelectedImage}
        />
        <RightSection
          assetData={assetData}
          isMenuOpen={isMenuOpen}
          openModal={openModal}
          selectedDocument={selectedDocument}
          setIsMenuOpen={setIsMenuOpen}
          setIsModalPreview={setIsModalPreview}
          setPreviewModalType={setPreviewModalType}
          setSelectedDocument={setSelectedDocument}
        />

        <ModalPreview
          isOpen={isModalPreview}
          selectedImage={selectedImage}
          type={previewModalType}
          selectedDocument={selectedDocument}
          handleApprove={approveDoc}
          handleReject={rejectDoc}
          handleClose={handleClosePreview}
          status={assetData.status}
          closable={false}
        />

        <StyledModal
          isOpen={isOpen}
          type={modalConfig.type}
          actionType={modalConfig.actionType as ActionType}
          handleCancel={handleCloseModal}
          handleConfirm={handleConfirm}
          remarks={modalConfig.remarks}
          hasSuspensionPeriod={modalConfig.hasSuspensionPeriod}
          name={modalConfig.name}
          issueTokens={modalConfig.issueTokens}
          isApproveAssetModal={modalConfig.type === 'assets' && modalConfig.actionType === 'approve'}
          remarksText={remarksText}
          setRemarksText={setRemarksText}
          tokens={tokens}
          setTokens={setTokens}
          listedDate={listedDate}
          price={assetData.price}
          onDateChange={(date: string) => {
            if (date) setListedDate(new Date(date));
          }}
          featuredAsset={isfeaturedAsset}
          setFeaturedAsset={setIsFeaturedAsset}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default AssetDetailsPage;
