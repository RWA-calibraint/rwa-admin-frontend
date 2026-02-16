import { useCallback } from 'react';

import { Document } from '@components/asset-details/interface';
import { ASSET_MODAL_TYPE } from '@helpers/constants/asset.status';
import { DOC_TYPE, DOCUMENT_MODAL_TYPE } from '@helpers/constants/document-type';

import { UseModalProps } from './hooks.interfaces';

export const useModals = ({
  openModal,
  setIsModalPreview,
  setSelectedDocument,
  setPreviewModalType,
}: UseModalProps) => {
  const resetPreviewState = useCallback(() => {
    setIsModalPreview(false);
  }, [setIsModalPreview]);

  const handleAssetModal = useCallback(
    (modalType: ASSET_MODAL_TYPE, isTokenModal = false) => {
      openModal('assets', modalType, isTokenModal);
      resetPreviewState();
    },
    [openModal, resetPreviewState],
  );

  const handleDocumentModal = useCallback(
    (modalType: DOCUMENT_MODAL_TYPE) => {
      openModal('documents', modalType);
      resetPreviewState();
    },
    [openModal, resetPreviewState],
  );

  const mintAndListAsset = useCallback(() => handleAssetModal(ASSET_MODAL_TYPE.APPROVE), [handleAssetModal]);
  const rejectAsset = useCallback(() => handleAssetModal(ASSET_MODAL_TYPE.REJECT), [handleAssetModal]);
  const holdAsset = useCallback(() => handleAssetModal(ASSET_MODAL_TYPE.HOLD), [handleAssetModal]);
  const deleteAsset = useCallback(() => handleAssetModal(ASSET_MODAL_TYPE.DELETE), [handleAssetModal]);
  const delistAsset = useCallback(() => handleAssetModal(ASSET_MODAL_TYPE.DELIST), [handleAssetModal]);
  const listAsset = useCallback(() => handleAssetModal(ASSET_MODAL_TYPE.LIST), [handleAssetModal]);
  const handleIssueTokens = useCallback(() => handleAssetModal(ASSET_MODAL_TYPE.TOKENS, true), [handleAssetModal]);

  const approveDoc = useCallback(() => handleDocumentModal(DOCUMENT_MODAL_TYPE.APPROVE), [handleDocumentModal]);
  const rejectDoc = useCallback(() => handleDocumentModal(DOCUMENT_MODAL_TYPE.REJECT), [handleDocumentModal]);
  const handleRemoveApproval = useCallback(() => {
    handleDocumentModal(DOCUMENT_MODAL_TYPE.REMOVE);
  }, [handleDocumentModal]);

  const handlePreview = useCallback(
    (doc: Document) => {
      setSelectedDocument(doc);
      setIsModalPreview((prev) => !prev);

      const docType = /\.(jpg|jpeg|png|svg)$/i.test(doc.documentUrl) ? DOC_TYPE.IMAGE : DOC_TYPE.DOCUMENT;

      setPreviewModalType(docType);
    },
    [setSelectedDocument, setIsModalPreview, setPreviewModalType],
  );

  return {
    mintAndListAsset,
    rejectAsset,
    holdAsset,
    deleteAsset,
    delistAsset,
    listAsset,
    approveDoc,
    rejectDoc,
    handleIssueTokens,
    handleRemoveApproval,
    handlePreview,
  };
};
