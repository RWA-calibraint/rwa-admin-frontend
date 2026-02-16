import { Modal } from 'antd';
import { X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { ASSET_STATUS } from '@helpers/constants/asset.status';
import { STATUS } from '@helpers/constants/document-status';
import { DOC_TYPE } from '@helpers/constants/document-type';

import { PreviewModalProps } from './interface';
import './modal-preview.scss';

const showButtons = [ASSET_STATUS.NEWLY_ADDED, ASSET_STATUS.RE_SUBMITTED, ASSET_STATUS.HOLD];

const ModalPreview = ({
  selectedImage,
  isOpen,
  selectedDocument,
  type,
  handleApprove,
  handleReject,
  handleClose,
  closable = false,
  status,
}: PreviewModalProps) => {
  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      onClose={handleClose}
      centered={false}
      footer={null}
      closable={closable}
      width={'80%'}
      className="modal-preview-container"
    >
      <div className="fullscreen-modal">
        <div className="p-y-20 p-x-24 d-flex align-center justify-space-between bg-black">
          <h2 className="f-18-22-500-white m-0">
            {selectedDocument ? selectedDocument?.documentName : selectedImage?.split('/').pop()}
          </h2>
          <X className="cursor-pointer icon-white" onClick={handleClose} />
        </div>

        {type === DOC_TYPE.IMAGE ? (
          <Image
            src={selectedDocument ? selectedDocument.documentUrl : selectedImage || ''}
            alt="Preview"
            width={800}
            height={600}
            style={{ width: '100%' }}
            className="d-block w-100 h-100"
          />
        ) : (
          <div className="p-x-20 bg-black d-flex align-center justify-center">
            <iframe src={selectedDocument?.documentUrl} title="PDF Viewer" loading="lazy" frameBorder={0} />
          </div>
        )}
        {showButtons.includes(status as ASSET_STATUS) && selectedDocument?.status === STATUS.PENDING && (
          <div className="p-y-20 p-x-24 d-flex align-center justify-flex-end gap-3 width-100 bg-black">
            <button key="reject" className="btn btn-error-outline" onClick={handleReject}>
              Reject
            </button>
            <button key="submit" onClick={handleApprove} className="btn btn-success-default">
              Approve
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalPreview;
