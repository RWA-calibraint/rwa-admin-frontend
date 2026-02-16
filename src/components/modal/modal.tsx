'use client';

import { Checkbox, DatePicker, Form, Input, Modal, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import { CalendarDays, LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';

import { ASSET_MODAL_TYPE } from '@helpers/constants/asset.status';
import { toLocalISOString } from '@helpers/constants/services/date-formatter';
import { showErrorToast } from '@helpers/constants/toast.notification';

import { ModalContent, ModalProps, ModalTypeContent } from './interface';
import { modalContent } from './modal-content';

const StyledModal: React.FC<ModalProps> = ({
  type,
  isOpen,
  className = '',
  onDateChange,
  hasSuspensionPeriod = false,
  remarks = false,
  name = '',
  actionType,
  closable = false,
  handleCancel,
  handleConfirm,
  issueTokens,
  isApproveAssetModal,
  tokens,
  setTokens,
  remarksText,
  setRemarksText,
  featuredAsset,
  setFeaturedAsset,
  price = 0,
  loading,
}) => {
  const [errors, setErrors] = useState({
    remarks: {
      hasError: false,
      errorMessage: '',
    },
    tokens: {
      hasError: false,
      errorMessage: '',
    },
    listedDate: {
      hasError: false,
      errorMessage: '',
    },
  });
  const modalType = type as keyof ModalContent;
  const typeContent = modalContent[modalType] as ModalTypeContent;
  const content = typeContent[actionType];
  const [form] = Form.useForm();

  if (!modalContent[modalType]) {
    showErrorToast(`Modal content not found for type: ${type}`);

    return null;
  }

  if (!typeContent[actionType]) {
    showErrorToast(`Action type ${actionType} not found for modal type: ${type}`);

    return null;
  }

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {
      remarks: { hasError: false, errorMessage: '' },
      tokens: { hasError: false, errorMessage: '' },
      listedDate: { hasError: false, errorMessage: '' },
    };

    if (remarks && remarksText?.trim() === '') {
      newErrors.remarks = {
        hasError: true,
        errorMessage: 'Remarks should not be empty',
      };
      isValid = false;
    }

    if (isApproveAssetModal) {
      const listingDate = form.getFieldValue('listingDate');

      if (!listingDate) {
        newErrors.listedDate = {
          hasError: true,
          errorMessage: 'Listing date should not be empty',
        };
        isValid = false;
      }
    }

    if (issueTokens) {
      if (!tokens || Number(tokens) < 10) {
        newErrors.tokens = {
          hasError: true,
          errorMessage: 'Number of tokens must be greater than or equal to ten',
        };
        isValid = false;
      }
    }

    setErrors(newErrors);

    return isValid;
  };

  const resetErrors = () => {
    setErrors({
      remarks: { hasError: false, errorMessage: '' },
      tokens: { hasError: false, errorMessage: '' },
      listedDate: { hasError: false, errorMessage: '' },
    });
  };

  const clearFields = () => {
    setTokens?.('');
    setRemarksText?.('');
  };

  const handleApprove = async () => {
    const valid = validateInputs();

    if (!valid) return;
    handleConfirm();
    clearFields();
  };

  const cancelHandler = () => {
    handleCancel();
    clearFields();
    resetErrors();
  };

  const description = typeof content.description === 'function' ? content.description(name) : content.description;

  return (
    <Modal
      centered
      open={isOpen}
      onCancel={cancelHandler}
      onClose={cancelHandler}
      footer={null}
      className={className}
      destroyOnClose
      closable={closable}
    >
      <div className="d-flex flex-column gap-6 p-x-24 p-y-24">
        <div className="d-flex flex-column gap-3 ">
          <h1 className="f-18-22-600-primary text-left">{content.heading}</h1>
          <div className="f-14-20-400-tertiary" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        {issueTokens && (
          <div className="d-flex flex-column gap-4">
            <div className="d-flex flex-column gap-2">
              <Form layout="vertical" form={form}>
                <Form.Item
                  label={
                    <span>
                      Tokens <span className="f-14-16-500-status-red">*</span>
                    </span>
                  }
                  name="tokens"
                  className="m-b-0"
                  rules={[
                    {
                      required: true,
                      message: 'Enter the fraction of token to be sold',
                    },
                    {
                      validator: (_, value) => {
                        const minTokens = 10;

                        if (value && Number(value) < minTokens) {
                          return Promise.reject(new Error(`Minimum value allowed is ${minTokens}`));
                        }

                        const pricePerToken = Number(tokens) > 0 ? (price / Number(tokens)).toLocaleString() : 0;

                        if (value && Number(pricePerToken) < 0.5) {
                          return Promise.reject(
                            new Error(
                              `Price per token must be at least 0.5. Either decrease tokens or edit the asset Price`,
                            ),
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter the fraction of token to be sold"
                    type="text"
                    min={10}
                    onChange={(e) => {
                      const value = e.target.value;

                      setTokens?.(isNaN(Number(value)) ? '' : value);
                    }}
                  />
                </Form.Item>
              </Form>
              {errors.tokens.hasError && <p className="p-y-4 f-14-20-400-red">{errors.tokens.errorMessage}</p>}
            </div>
            <div className="d-flex flex-column p-x-16 p-y-16 gap-5 border-primary-1 radius-8">
              <p className="f-14-20-600-primary">Tokenization Breakdown</p>
              <div className="d-flex align-center justify-space-between f-14-16-400-secondary">
                <p>Price per token ($USD)</p>
                <p>${Number(tokens) > 0 ? (price / Number(tokens)).toLocaleString() : 0}</p>
              </div>
              <div className="d-flex align-center justify-space-between f-14-16-400-secondary">
                <p>Total Asset Value ($USD)</p>
                <p>${price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {isApproveAssetModal && (
          <div className="d-flex flex-column gap-3">
            <Form form={form} layout="vertical">
              <Form.Item
                label={
                  <span>
                    Listing Date <span className="f-14-16-500-status-red">*</span>
                  </span>
                }
                name="listingDate"
                className="m-b-16"
                rules={[
                  {
                    required: true,
                    message: 'Enter the listing date',
                  },
                ]}
              >
                <DatePicker
                  inputReadOnly
                  onChange={(value) => {
                    onDateChange?.(String(toLocalISOString(new Date(value.toDate()))));
                  }}
                  type="date"
                  className={`p-x-12 p-y-12 radius-6 width-100 border-primary-1 ${
                    errors.listedDate.hasError ? 'border-failure-1' : ''
                  }`}
                  minDate={dayjs(Date.now())}
                  suffixIcon={<CalendarDays className="img-16" />}
                />
              </Form.Item>
            </Form>
            <div className="d-flex align-center gap-2">
              <Checkbox checked={featuredAsset} onChange={(e) => setFeaturedAsset?.(e.target.checked)} />
              <p className="f-14-20-400-primary">Make it as a featured asset</p>
            </div>
            {errors.listedDate.hasError && <p className="p-y-4 f-14-20-400-red">{errors.listedDate.errorMessage}</p>}
          </div>
        )}

        {hasSuspensionPeriod && (
          <div className="m-t-24">
            <h3 className="f-14-16-500-input-lable m-b-8">Suspension Period</h3>

            <DatePicker
              onChange={(value) => {
                onDateChange?.(String(value.toDate()));
              }}
              placeholder="Pick a date"
              type="date"
              showNow={false}
              inputReadOnly
              suffixIcon={<CalendarDays className="img-16" />}
              className="width-100"
              disabledDate={(current) => current && current.toDate() < new Date()}
            />
          </div>
        )}

        {remarks && (
          <div className="d-flex flex-column gap-3">
            <h3>
              Remarks &nbsp;<span className="f-14-22-500-failure">*</span>
            </h3>
            <TextArea
              rows={5}
              value={remarksText}
              onChange={(e) => {
                setRemarksText?.(e.target.value);
                resetErrors();
              }}
              placeholder={`${actionType === ASSET_MODAL_TYPE.HOLD ? 'Explain why this asset was only Hold' : 'Write your remarks here'} `}
              maxLength={300}
              className={errors.remarks.hasError ? 'border-failure-1' : ''}
              style={{ resize: 'none' }}
              required={true}
            />
            {errors.remarks.hasError && <p className="p-y-4 f-14-20-400-red">{errors.remarks.errorMessage}</p>}
            <p className="d-flex align-center justify-flex-end f-14-20-400-tertiary p-y-8">{remarksText?.length}/300</p>
          </div>
        )}

        <div className="d-flex align-center justify-flex-end">
          <button
            key="cancel"
            className="bg-white p-x-16 p-y-12 m-r-12 f-14-20-500-t-o-s radius-6 border-primary-1 cursor-pointer"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button
            key="submit"
            className={`p-x-16 p-y-12 radius-6 f-14-20-500-brand-white bg-approve-button border-primary-1 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} d-flex align-center gap-2 ${
              content.heading.includes('Delete') ||
              content.heading.includes('Block') ||
              content.heading.includes('Resubmission') ||
              content.heading.includes('Reject')
                ? loading
                  ? 'bg-disabled-red'
                  : 'bg-default-button '
                : loading
                  ? 'bg-disabled-blue'
                  : 'bg-approve-button'
            }`}
            onClick={handleApprove}
            disabled={loading}
          >
            {loading && <Spin indicator={<LoaderCircle className="icon-white spin" />} size="small" />}
            {content.heading}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StyledModal;
