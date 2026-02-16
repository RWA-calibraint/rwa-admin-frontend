import { Input } from 'antd';
import Modal from 'antd/es/modal/Modal';
import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ASSSET_ACTION } from '@/helpers/constants/asset.status';
import { STRIPE_MAX_PAYMENT_AMOUNT, STRIPE_MIN_PAYMENT_AMOUNT } from '@/helpers/constants/constants';
import { ERROR_MESSAGE } from '@/helpers/constants/error-mesage';
import { calculateTokenPrice } from '@/helpers/constants/services/number-formatter';
import { SUCCESS_MESSAGES } from '@/helpers/constants/succes-messages';
import { showErrorToast, showSuccessToast } from '@/helpers/constants/toast.notification';
import {
  useBurnTokensMutation,
  useGetAssetDetailQuery,
  useMintTokensMutation,
  useUpdateAssetPriceMutation,
} from '@/redux/apis/assets.api';

import Button from '../Button/Button';

import { TokenModalProps } from './interface';

const TokensModal: React.FC<TokenModalProps> = ({
  type,
  isOpen,
  className = '',
  closable = false,
  handleCancel,
  handleConfirm,
  availableTokens,
  setTokens,
  setPrice,
  tokens,
  price,
  issuedTokens,
  currentValue,
  assetData,
}) => {
  const [errors, setErrors] = useState({
    tokenError: '',
    priceError: '',
  });

  const [mintTokens, { isLoading: isMinting }] = useMintTokensMutation();
  const [burnTokens, { isLoading: isBurning }] = useBurnTokensMutation();
  const [updateAssetPrice, { isLoading: isUpdating }] = useUpdateAssetPriceMutation();
  const { data: assetDetail, isLoading: isAssetLoading } = useGetAssetDetailQuery(assetData.assetId);

  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    if (tokens > availableTokens) {
      setErrors((prev) => ({
        ...prev,
        tokenError: `Available tokens: ${availableTokens}. Please enter a value of ${availableTokens} or less.`,
      }));
    }
  }, [tokens, availableTokens]);

  useEffect(() => {
    const minPrice = 10;

    const numValue = Number(price);

    const pricePerToken = availableTokens
      ? numValue / (type === ASSSET_ACTION.MINT ? tokens + issuedTokens : availableTokens - tokens)
      : 0;

    if ((pricePerToken === Infinity || tokens > availableTokens) && type === ASSSET_ACTION.BURN) return;

    if (price && (isNaN(numValue) || numValue <= 0)) {
      setErrors((prevState) => ({
        ...prevState,
        priceError: 'Price must be a positive number',
      }));
    }

    if (price && tokens) {
      if (pricePerToken < STRIPE_MIN_PAYMENT_AMOUNT) {
        setErrors((prevState) => ({
          ...prevState,
          tokenError: `Price per token must be at least $${STRIPE_MIN_PAYMENT_AMOUNT}. Either increase price or decrease tokens.`,
        }));
      }

      if (pricePerToken > STRIPE_MAX_PAYMENT_AMOUNT) {
        setErrors((prevState) => ({
          ...prevState,
          priceError: `Price per token must not exceed $${STRIPE_MAX_PAYMENT_AMOUNT.toLocaleString()}. Either decrease price or increase tokens.`,
        }));
      }
    }

    if (price && numValue < minPrice) {
      setErrors((prevState) => ({
        ...prevState,
        priceError: `Minimum value allowed is ${minPrice}`,
      }));
    }

    if (price && pricePerToken > STRIPE_MAX_PAYMENT_AMOUNT) {
      setErrors((prevState) => ({
        ...prevState,
        priceError: `Maximum value allowed is ${STRIPE_MAX_PAYMENT_AMOUNT}`,
      }));
    }
  }, [issuedTokens, price, tokens, type, availableTokens]);

  const validateFields = () => {
    let isValid = true;

    if (!price || price < 0) {
      setErrors((prev) => ({ ...prev, priceError: 'Please enter a valid price' }));
      isValid = false;
    }

    if ((!tokens || tokens < 0) && (type === ASSSET_ACTION.MINT || type === ASSSET_ACTION.BURN)) {
      setErrors((prev) => ({ ...prev, tokenError: 'Please enter valid number of tokens' }));
      isValid = false;
    }

    return isValid;
  };

  const handleConfirmClick = async () => {
    if (!validateFields() || isAssetLoading || !assetDetail?.response?.contractTokenId) {
      return;
    }

    try {
      const tokenAction = {
        contractTokenId: assetDetail?.response.contractTokenId,
        assetId: assetDetail?.response.assetId, // Use tokenId from asset detail
        amount: tokens,
        price,
      };

      if (type === ASSSET_ACTION.MINT) {
        await mintTokens(tokenAction).unwrap();
        showSuccessToast(SUCCESS_MESSAGES.MINT_SUCCESS);
      } else if (type === ASSSET_ACTION.BURN) {
        await burnTokens(tokenAction).unwrap();

        showSuccessToast(SUCCESS_MESSAGES.BURN_SUCCESS);
      } else {
        // update API call goes here
        await updateAssetPrice({
          assetId: assetDetail?.response.assetId,
          price: price,
        }).unwrap();
        showSuccessToast(SUCCESS_MESSAGES.UPDATE_ASSET);
      }

      setChange(null);
      handleConfirm(); // Close modal and update UI
    } catch (error) {
      showErrorToast(ERROR_MESSAGE.OPERATION_FAILED);
    }
  };

  const handleCancelClick = () => {
    setChange(null);
    resetErrors();
    handleCancel();
  };

  const resetErrors = () => {
    setErrors({ tokenError: '', priceError: '' });
  };

  return (
    <Modal
      centered
      open={isOpen}
      onCancel={handleCancelClick}
      onClose={handleCancelClick}
      footer={null}
      className={className}
      destroyOnClose
      closable={closable}
      maskClosable={false}
      style={{ zIndex: 10 }}
      width={440}
    >
      <div className="d-flex flex-column gap-6 p-24">
        <div className="d-flex flex-column gap-3">
          <p className="f-18-20-600-primary">
            {type === ASSSET_ACTION.MINT
              ? 'Mint tokens '
              : type === ASSSET_ACTION.BURN
                ? 'Burn tokens'
                : 'Update Asset'}
          </p>
          <p className="f-14-16-400-tertiary">
            {type === ASSSET_ACTION.MINT
              ? `Set the total number of tokens and define the asset’s value to make it available for fractional ownership.`
              : type === ASSSET_ACTION.BURN
                ? `Reduce the total supply of available tokens by permanently removing unsold fractions. Optionally update the asset valuation to maintain it to increase the value per token.`
                : `Define the asset’s value to make it available for fractional ownership.`}
          </p>
        </div>
        <div className={`d-flex flex-column ${type === ASSSET_ACTION.MINT ? '' : 'gap-4'}`}>
          <div className="d-flex flex-column gap-2">
            {type !== ASSSET_ACTION.UPDATE ? (
              <p className="f-14-16-500-primary">
                No of Tokens to {type === ASSSET_ACTION.MINT ? 'Mint' : 'Burn'}{' '}
                <span className="f-14-16-500-status-red">*</span>{' '}
              </p>
            ) : null}
            {type === ASSSET_ACTION.MINT ? (
              <>
                <Input
                  value={tokens}
                  placeholder="E.g., 10, 50, 100"
                  className={`${errors.tokenError ? 'border-red-1' : ''}`}
                  onChange={(e) => {
                    resetErrors();
                    setTokens(Number.isNaN(e) ? 0 : parseInt(e.target.value) || 0);
                  }}
                />
                {errors.tokenError && <p className="p-t-4 f-14-16-500-err-text">{errors.tokenError}</p>}
              </>
            ) : type === ASSSET_ACTION.BURN ? (
              <div>
                <Input
                  value={tokens}
                  placeholder="E.g., 10, 50, 100"
                  onChange={(e) => {
                    resetErrors();
                    setTokens(Number.isNaN(e) ? 0 : parseInt(e.target.value) || 0);
                  }}
                  className={`${errors.tokenError ? 'border-red-1' : ''}`}
                />
                {errors.tokenError && <p className="p-t-4 f-14-16-500-err-text">{errors.tokenError}</p>}
              </div>
            ) : null}
            {type !== ASSSET_ACTION.UPDATE ? (
              <p className="f-14-16-400-tertiary">
                {type === ASSSET_ACTION.MINT ? 'Issued Tokens' : 'Available Tokens(Unsold)'}:
                {type === ASSSET_ACTION.MINT ? issuedTokens : availableTokens}
              </p>
            ) : null}
          </div>
          <div className="d-flex flex-column gap-2">
            {type === ASSSET_ACTION.UPDATE && (
              <>
                <p className="f-14-16-500-primary">Updated Asset Valuation </p>
                <Input
                  placeholder="1200"
                  value={price}
                  prefix={<DollarSign />}
                  className={`${errors.priceError ? 'border-red-1' : ''}`}
                  onChange={(e) => {
                    resetErrors();
                    setPrice(Number.isNaN(e) ? 0 : parseInt(e.target.value) || currentValue);

                    const raw = e.target.value;
                    const parsed = parseInt(raw);

                    if (raw === '' || isNaN(parsed)) {
                      setPrice(0); // or '' if you want

                      return;
                    }

                    if (parsed < currentValue) {
                      setErrors({ ...errors, priceError: 'Value must be greater than current asset value' });

                      return;
                    }

                    setPrice(parsed);
                    const percentageChange = ((parsed - currentValue) / currentValue) * 100;

                    setChange(Number(percentageChange.toFixed(2)));
                  }}
                />
                {errors.priceError && <p className="p-t-4 f-14-16-500-err-text">{errors.priceError}</p>}
              </>
            )}

            {/* {type !== ASSSET_ACTION.MINT && (
              <p className="f-14-16-400-tertiary">Current asset value : {currentValue}</p>
            )} */}
          </div>
          {type !== ASSSET_ACTION.MINT ? (
            <div className="d-flex flex-column gap-5 p-16 radius-6 border-primary-1">
              <p className="f-14-16-600-primary">Tokenization Breakdown</p>
              <div className="d-flex flex-column gap-3 f-14-16-400-secondary">
                {type === ASSSET_ACTION.BURN && (
                  <>
                    <div className="d-flex align center justify-space-between">
                      <p>Number of tokens issued</p>
                      <p>$ {issuedTokens}</p>
                    </div>
                    <div className="d-flex align center justify-space-between">
                      <p>Tokens sold</p>
                      <p>{issuedTokens - availableTokens}</p>
                    </div>
                  </>
                )}
                <div className="d-flex align center justify-space-between">
                  <p>Price per token ($USD)</p>
                  <p>
                    $
                    {calculateTokenPrice(
                      price,
                      type === ASSSET_ACTION.UPDATE ? tokens + issuedTokens : issuedTokens - tokens,
                      2,
                    )}
                  </p>
                </div>
                <div className="d-flex align center justify-space-between">
                  <p className={`${change ? 'f-14-16-400-primary' : 'f-14-16-400-secondary'}`}>Value Change</p>
                  <p className={`${change ? 'f-14-16-500-success' : 'f-14-16-500-err-text'}`}>
                    {change && (change > 0 ? '+' : '-')}
                    {change ?? 0}%
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="d-flex align-center justify-flex-end">
          <div className="d-flex align-center gap-2">
            <button
              className="border-primary-1 bg-white radius-6 p-y-12 p-x-16 f-14-16-500-primary cursor-pointer"
              onClick={handleCancelClick}
              disabled={isBurning || isMinting || isUpdating}
            >
              Cancel
            </button>
            <div style={{ opacity: !!errors.tokenError || !!errors.priceError ? 0.5 : 1 }}>
              <Button
                className={`border-primary-1 bg-brand-color radius-6 p-y-12 p-x-16 f-14-16-500-white  ${!!errors.tokenError || !!errors.priceError ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={handleConfirmClick}
                loading={isMinting || isBurning || isUpdating}
                disabled={!!errors.tokenError || !!errors.priceError || isMinting || isBurning || isUpdating}
              >
                {type === ASSSET_ACTION.MINT
                  ? 'Mint tokens'
                  : type === ASSSET_ACTION.BURN
                    ? 'Burn tokens'
                    : 'Update Asset'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TokensModal;
