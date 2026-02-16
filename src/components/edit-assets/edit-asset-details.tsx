'use client';

import { DatePicker, Form, Input, Select, Upload, UploadProps } from 'antd'; // External libraries (antd)
import { CalendarDays } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react'; // React imports first
import { HTML5Backend } from 'react-dnd-html5-backend'; // Other external libraries
import { Descendant } from 'slate';

import { STRIPE_MAX_PAYMENT_AMOUNT, STRIPE_MIN_PAYMENT_AMOUNT } from '@/helpers/constants/constants';
import { ERROR_MESSAGE } from '@/helpers/constants/error-mesage';
import { showErrorToast } from '@/helpers/constants/toast.notification';
import { extractText } from '@/helpers/functions';
import { useAnalyseImageMutation } from '@/redux/apis/assets.api';
import { EditAssetDetailsProps } from '@components/edit-assets/interface';

import { CustomAlertBox } from '../AlertBox/alert-box';
import { DraggableUploadList } from '../draggable/draggable';
import TextEditor from '../text-editor/text-editor'; // Internal components

const DndProvider = dynamic(() => import('react-dnd').then((mod) => mod.DndProvider), { ssr: false });

const { Dragger } = Upload;

const EditAssetDetails: FC<EditAssetDetailsProps> = ({
  form,
  fileList,
  setFileList,
  setCategory,
  categoryOptions,
  description,
  setDescription,
  isTokensSold,
  assetPrice,
  assetTokens,
  onTokenError,
}) => {
  const patheName = usePathname();
  const [nameCount, setNameCount] = useState(0);
  const [price, setPrice] = useState<number>(assetPrice || 1);
  const [tokens, setTokens] = useState<number>(assetTokens || 0);
  const [analyzeImage] = useAnalyseImageMutation();

  const handleDescriptionChange = (value: Descendant[]) => {
    setDescription(value);
    form?.setFieldsValue({ description: value });
  };

  const checkImage = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append('image', file);

      const res = await analyzeImage({ data: formData }).unwrap();

      if (res.response?.quality?.overallScore > 0.5) {
        return true;
      }

      const errorMessage = res.response.recommendation ?? 'Image quality is not good';

      showErrorToast(errorMessage);

      return false;
    } catch (error) {
      showErrorToast('Failed to upload Image');

      return false;
    }
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    maxCount: 7,

    showUploadList: false,
    accept: '.png,.jpeg,.jpg,.mp4, .avi,.mov,.mkv',
    beforeUpload: async (newFile) => {
      const isVideo = newFile.type.startsWith('video/');
      const imageCheckResult = isVideo ? true : await checkImage(newFile);

      if (!imageCheckResult) {
        return Upload.LIST_IGNORE;
      }

      if (fileList.length === 7) {
        showErrorToast(new Error(ERROR_MESSAGE.NO_OF_FILES(7, 'images')));

        return Upload.LIST_IGNORE;
      }
      const isLimitGreaterThan2M = newFile.size / 1024 / 1024 >= 0.1;
      const isLimitLessThan5M = newFile.size / 1024 / 1024 <= 5;

      if (!isLimitLessThan5M) {
        showErrorToast(new Error(ERROR_MESSAGE.IMAGE_SIZE_LIMIT));

        return Upload.LIST_IGNORE;
      } else if (!isLimitGreaterThan2M) {
        showErrorToast(new Error(ERROR_MESSAGE.IMAGE_SIZE_LESS));

        return Upload.LIST_IGNORE;
      }
    },
    onChange: ({ fileList: newFileList }) => {
      if (form) form.setFieldsValue({ images: newFileList });
      if (setFileList) setFileList(newFileList);
    },
  };

  const handleCategoryChange = (
    value: string,

    option?: { label: string; key: string; value: string } | { label: string; key: string; value: string }[],
  ) => {
    if (Array.isArray(option)) {
      if (setCategory) setCategory(option[0]?.key || '');
    } else if (option) {
      if (setCategory) setCategory(option.key);
    }
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newFileList = fileList ? [...fileList] : [];
    const draggedFile = newFileList[dragIndex];

    if (!draggedFile) {
      showErrorToast('Dragged file is undefined or null');

      return;
    }
    newFileList[hoverIndex] = newFileList.splice(dragIndex, 1, newFileList[hoverIndex])[0];
    if (setFileList) setFileList(newFileList);
    if (form) form.setFieldsValue({ images: newFileList });
  };

  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    if (form) form.setFieldValue('images', fileList);

    if (tokens > 0 && tokens < 10) {
      const errorMsg = 'Minimum value allowed is 10 tokens.';

      setTokenError(errorMsg);
      form?.setFields([
        {
          name: 'tokens',
          errors: [errorMsg],
        },
      ]);
    } else {
      setTokenError(null);
    }
  }, [fileList, form, tokens]);

  useEffect(() => {
    if (onTokenError) {
      onTokenError(!!tokenError);
    }
  }, [tokenError, onTokenError]);

  const checkDescription = (_: unknown, value: Descendant[]) => {
    if (!value || value.length === 0) {
      return Promise.reject(new Error('Description is required'));
    }

    const text = extractText(value);

    if (!text || text.trim().length === 0) {
      return Promise.reject(new Error('Description is required'));
    }

    return Promise.resolve();
  };
  const calculateMinTokens = useMemo(() => {
    if (!price || price <= 9) {
      return 10;
    }

    const minTokensBasedOnPrice = price > STRIPE_MAX_PAYMENT_AMOUNT ? Math.ceil(price / STRIPE_MAX_PAYMENT_AMOUNT) : 1;
    const minRequired = Math.max(10, minTokensBasedOnPrice);

    return minRequired;
  }, [price]);

  return (
    <div
      className={`w-662 radius-12 bg-white  border-white-1 p-x-24 overflow-auto cardContainer ${patheName.includes('/create-asset') ? 'v-h-65' : 'v-h-72'}`}
    >
      <div className="border-white-1">
        <div>
          <Form.Item
            label={
              <span>
                Images <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="images"
            className="m-b-16"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              {
                required: true,
                message: 'Please upload at least one image',
              },
            ]}
          >
            <DndProvider backend={HTML5Backend}>
              <Dragger {...props}>
                <div className="d-flex align-center p-y-32 width-100 text-justify justify-center">
                  <Image src="/image-ref.svg" alt="image" width={52} height={52} />
                  <div className="m-l-16 max-w-240 text-left">
                    <p className="f-14-16-600-primary">
                      Drag and drop files here or <span className="f-14-16-600-brand-secondary">upload</span>
                    </p>
                    <p className="f-12-14-400-tertiary m-t-8">
                      Supported file format: .png, .jpeg Max 7 images, Each 5 mb.
                    </p>
                  </div>
                </div>
              </Dragger>
              {fileList.length > 0 && (
                <div className="m-b-16">
                  <DraggableUploadList fileList={fileList} moveImage={moveImage} setFileList={setFileList} />
                </div>
              )}
              {fileList && fileList.length <= 0 && (
                <div className="f-14-20-400-tertiary m-t-8">
                  Please ensure that the photos you upload are original and taken directly by you. Avoid using images
                  downloaded from websites, as only authentic asset photos will be accepted.
                </div>
              )}
            </DndProvider>
          </Form.Item>
          {categoryOptions.length > 0 && (
            <Form.Item
              label={
                <span>
                  Category <span className="f-14-16-500-status-red">*</span>
                </span>
              }
              name="category"
              className="m-b-16"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select" options={categoryOptions} onChange={handleCategoryChange} />
            </Form.Item>
          )}
          {/* Name */}
          <Form.Item
            label={
              <span>
                Name <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="name"
            className="m-b-0"
            rules={[
              { required: true, message: 'Please enter asset name' },
              { pattern: /^[a-zA-Z0-9][a-zA-Z0-9-_]*(?: [a-zA-Z0-9-_]+)*\s?$/, message: 'Enter a valid asset name' },
            ]}
          >
            <Input onChange={(e) => setNameCount(e.target.value.length)} placeholder="Asset name" maxLength={70} />
          </Form.Item>
          <div className="d-flex justify-flex-end f-14-20-400-tertiary m-t-8 m-b-16">{nameCount || 0}/70</div>
          {/* Slate Editor */}
          <Form.Item
            label={
              <span>
                Description <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="description"
            rules={[{ required: true, message: '' }, { validator: checkDescription }]}
            className="m-b-16"
            validateTrigger={['submit', 'onChange']}
          >
            <TextEditor onChange={handleDescriptionChange} value={description} />
          </Form.Item>
          {/* Price */}
          <Form.Item
            label={
              <span>
                Price in USD ($) <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="price"
            className="m-b-16"
            rules={[
              { required: true, message: 'Please enter price' },
              {
                validator: (_, value) => {
                  const minPrice = 10;

                  const numValue = Number(value);

                  const pricePerToken = tokens > 1 ? numValue / tokens : 0;

                  if (value && (isNaN(numValue) || numValue <= 0)) {
                    return Promise.reject(new Error('Price must be a positive number'));
                  }

                  if (value && tokens && tokens > 1) {
                    if (pricePerToken < STRIPE_MIN_PAYMENT_AMOUNT) {
                      return Promise.reject(
                        new Error(
                          `Price per token must be at least $${STRIPE_MIN_PAYMENT_AMOUNT}. Either increase price or decrease tokens.`,
                        ),
                      );
                    }

                    if (pricePerToken > STRIPE_MAX_PAYMENT_AMOUNT) {
                      return Promise.reject(
                        new Error(
                          `Price per token must not exceed $${STRIPE_MAX_PAYMENT_AMOUNT.toLocaleString()}. Either decrease price or increase tokens.`,
                        ),
                      );
                    }
                  }

                  if (value && numValue < minPrice) {
                    return Promise.reject(new Error(`Minimum value allowed is ${minPrice}`));
                  }

                  if (value && pricePerToken > STRIPE_MAX_PAYMENT_AMOUNT) {
                    return Promise.reject(new Error(`Maximum value allowed is ${STRIPE_MAX_PAYMENT_AMOUNT}`));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger={['onSubmit', 'onChange']}
          >
            <Input
              placeholder="Amount"
              type="text"
              onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue === '') {
                  setPrice(0);
                  form?.setFieldValue('price', '');
                } else {
                  if (!isNaN(Number(inputValue))) {
                    setPrice(Number(inputValue));
                    form?.setFieldValue('price', inputValue);
                  }
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Tokens <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="tokens"
            className="m-b-0"
            rules={[
              { required: true, message: 'Enter the fraction of token to be sold' },
              {
                validator: (_, value) => {
                  if (value === '' || value === undefined) {
                    return Promise.resolve();
                  }

                  const numValue = Number(value);

                  if (isNaN(numValue) || numValue <= 0) {
                    return Promise.reject(new Error('Tokens must be a positive number'));
                  }

                  const minTokens = 10;

                  if (numValue < minTokens) {
                    return Promise.reject(new Error(`Minimum value allowed is ${minTokens} tokens.`));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger={['onSubmit', 'onChange']}
          >
            <Input
              placeholder="Enter the fraction of token to be sold"
              type="text"
              onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue === '') {
                  setTokens(0);
                  form?.setFieldValue('tokens', '');
                } else {
                  if (!isNaN(Number(inputValue))) {
                    setTokens(Number(inputValue));
                    form?.setFieldValue('tokens', inputValue);
                  }
                }
              }}
              disabled={isTokensSold}
            />
          </Form.Item>
          <div className="m-b-16 m-t-8">
            {price && tokens ? (
              <CustomAlertBox>
                <p className="f-14-16-500-selected-image ">
                  Price per token: {isNaN(Number(price / tokens)) ? '0' : (price / tokens).toLocaleString()}
                </p>
              </CustomAlertBox>
            ) : null}
          </div>
          {patheName.includes('/create-asset') && (
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
                placeholder="Select the listing date "
                inputReadOnly
                className="width-100"
                disabledDate={(current) => current && current.toDate() < new Date(new Date().setHours(0, 0, 0, 0))}
                suffixIcon={<CalendarDays className="img-16" type="date" />}
              />
            </Form.Item>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAssetDetails;
