'use client';

import { Button, Card, Form, Steps, UploadFile } from 'antd';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Descendant } from 'slate';

import { SUCCESS_MESSAGES } from '@/helpers/constants/succes-messages';
import { showErrorToast, showSuccessToast } from '@/helpers/constants/toast.notification';
import { clearFormData } from '@/helpers/services/clear-formdata';
import { EditAssetDetails, EditAssetDocument, EditAssetHistory, EditAssetLocation } from '@components/edit-assets';
import { AssetHistoryType } from '@components/edit-assets/interface';
import { useGetAssetCategoriesQuery } from '@redux/apis/assets.api';
import { useCreateAssetMutation } from '@redux/apis/create-asset.api';

import '@app/create-asset/create-page.scss';
import { UpdatedDocsList, UploadDocInterface } from '../asset-edit/edit.interface';

const { Step } = Steps;

const formData = new FormData();

const CreateAsset = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [currentForm, setCurrentForm] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<AssetHistoryType[]>([{ key: 1, listedDate: null, price: 0, hasAddedRow: false }]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const [address, setAddress] = useState<string>('');
  const [docList, setdocList] = useState<Record<string, UploadDocInterface[]>>({});

  const [createAsset] = useCreateAssetMutation();
  const { data: categories, isFetching } = useGetAssetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });

  const categoryOptions = useMemo(() => {
    if (!isFetching && categories?.response?.length)
      return categories.response.map(({ category, _id }) => ({ label: category, key: _id, value: category }));

    return [];
  }, [categories, isFetching]);

  const validateForm = useCallback(async () => {
    try {
      const formValues = await form.validateFields();

      return formValues;
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      return false;
    }
  }, [form]);

  const handleNext = async () => {
    const formValues = await validateForm();

    if (formValues) {
      switch (currentForm) {
        case 1:
          formValues?.images?.forEach((file: { originFileObj: Blob }) => {
            formData.append('images', file.originFileObj);
          });
          formData.set('category', category);
          formData.set('name', formValues.name);
          formData.set('price', formValues.price);
          formData.set('description', JSON.stringify(description));
          formData.set('tokens', formValues?.tokens ?? 1);
          formData.set('listedDate', new Date(formValues?.listingDate).toString());

          break;

        case 2: {
          formData.set(
            'documents',
            JSON.stringify(
              Object.keys(docList).reduce(
                (updatedDocs, key) => {
                  updatedDocs[key] = docList[key].map((doc) => ({
                    name: doc.name,
                    url: doc?.uploadedS3Url ?? '',
                  }));

                  return updatedDocs;
                },
                {} as Record<string, UpdatedDocsList[]>,
              ),
            ),
          );

          break;
        }

        case 3:
          // const isValid = await isValidPostalCode(formValues.postalCode, formValues.city);
          formData.set('country', formValues.country);
          formData.set('state', formValues.state);
          formData.set('city', formValues.city);
          formData.set('address', formValues.address);
          formData.set('pincode', formValues.postalCode);

          break;

        case 4:
          setLoading(true);
          formData.set('priceHistory', JSON.stringify(rows.map((row) => ({ price: row.price, year: row.listedDate }))));
          // TODO: Need to get it from checkbox once design completed
          formData.set('isFeaturedAsset', 'true');
          try {
            await createAsset(formData).unwrap();

            showSuccessToast(SUCCESS_MESSAGES.ASSET_CREATED);
            setLoading(false);
            clearFormData(formData);
            router.push('asset/pending-assets');

            return;
          } catch (error) {
            setLoading(false);
            showErrorToast(error);
            break;
          }

        default:
          break;
      }
      setCurrentForm((prev) => (prev < 4 ? prev + 1 : prev));
    }
  };

  const handleBack = () => {
    setCurrentForm((prev) => (prev > 1 ? prev - 1 : prev));
    if (currentForm === 3) {
      formData.delete('documents');
    } else if (currentForm === 2) {
      formData.delete('images');
    }
  };

  const renderStepContent = () => {
    switch (currentForm) {
      case 1:
        return (
          <EditAssetDetails
            form={form}
            categoryOptions={categoryOptions}
            fileList={fileList}
            setFileList={setFileList}
            setCategory={setCategory}
            description={description}
            setDescription={setDescription}
          />
        );
      case 2:
        return <EditAssetDocument form={form} setDocList={setdocList} docList={docList} />;
      case 3:
        return <EditAssetLocation form={form} address={address} setAddress={setAddress} />;
      case 4:
        return <EditAssetHistory rows={rows} setRows={setRows} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-secondary">
      <div className="d-flex justify-center align-center position-relative flex-column m-y-20">
        <div className="w-80 m-b-16 d-flex self-start m-l-16">
          <button
            className="text-gray-900 cursor-pointer main-button d-flex align-center gap-2"
            onClick={() => router.push('asset/pending-assets')}
          >
            <ChevronLeft className="img-16" />
            <p className="f-14-16-500-o-s">Back to pending asset</p>
          </button>
        </div>
        <Card className="width-80 overflow-auto p-0">
          <div className="p-x-24 p-y-22 border-bottom-primary-1 position-sticky top-0 z-index-1 bg-white">
            <Steps current={currentForm - 1} size="small">
              <Step title="Details" />
              <Step title="Documents" />
              <Step title="Location" />
              <Step title="Asset History" />
            </Steps>
          </div>
          <div className="p-x-24 p-t-24">
            <Form form={form} layout="vertical" requiredMark={false}>
              {renderStepContent()}
            </Form>
          </div>
          <div className="d-flex justify-flex-end gap-2 p-r-24 p-y-24 position-sticky bottom-0 z-index-1 bg-white footer-button">
            {currentForm > 1 && !loading && (
              <Button
                type="text"
                size="large"
                className="border-brand-color-1 back"
                onClick={handleBack}
                disabled={Object.values(docList)
                  .flat()
                  .some((doc) => !doc.uploadedS3Url)}
              >
                Back
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              className="bg-brand-color continue"
              loading={loading}
              onClick={handleNext}
              disabled={Object.values(docList)
                .flat()
                .some((doc) => !doc.uploadedS3Url)}
            >
              {currentForm < 4 ? 'Continue' : 'Finish'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateAsset;
