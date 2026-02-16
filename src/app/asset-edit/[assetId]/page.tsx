'use client';
import { Button, Card, Form, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import { ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Descendant } from 'slate';

import { EditAssetDetails, EditAssetDocument, EditAssetHistory, EditAssetLocation } from '@components/edit-assets';
import { getMimeType } from '@components/edit-assets/constants';
import { AssetHistoryType } from '@components/edit-assets/interface';
import AntdTabs from '@components/tabs/tabs';
import { useEditAssetMutation, useGetAssetCategoriesQuery, useGetAssetDetailQuery } from '@redux/apis/assets.api';

import { documentType, priceHistoryInterface, UpdatedDocsList, UploadDocInterface } from '../edit.interface';

const EditAsset = () => {
  const params = useParams();
  const assetId = params.assetId;
  const router = useRouter();
  const [editAsset, { isLoading }] = useEditAssetMutation();
  const { data: assetDetail } = useGetAssetDetailQuery(String(assetId), { refetchOnMountOrArgChange: true });
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const [rows, setRows] = useState<AssetHistoryType[]>([{ key: 1, listedDate: null, price: 0, hasAddedRow: false }]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [category, setCategory] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const [hasTokenError, setHasTokenError] = useState(false);
  const [docList, setdocList] = useState<Record<string, UploadDocInterface[]>>({});

  const { data: categories, isFetching } = useGetAssetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });

  const categoryOptions = useMemo(() => {
    if (!isFetching && categories?.response?.length)
      return categories.response.map(({ category, _id }) => ({ label: category, key: _id, value: category }));

    return [];
  }, [categories, isFetching]);

  const constructImages = useCallback(
    async (mediaUrls: string[]) => {
      try {
        const formattedFiles = await Promise.allSettled(
          mediaUrls.map(async (url, index) => {
            try {
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Cache-Control': 'no-cache',
                },
              });

              if (!response.ok) {
                console.error(`Failed to fetch media ${index}:`, response.status);

                return null;
              }

              const blob = await response.blob();
              const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
              const isVideo =
                videoExtensions.some((ext) => url.toLowerCase().endsWith(ext)) || blob.type.startsWith('video/');

              const fileName = isVideo
                ? `video_${index}.${url.split('.').pop()}`
                : `image_${index}.${url.split('.').pop()}`;

              const file = new File([blob], fileName, { type: blob.type }) as RcFile;

              file.uid = String(Date.now() + index);
              const previewUrl = URL.createObjectURL(blob);

              const uploadFile: UploadFile = {
                uid: file.uid,
                name: file.name,
                status: 'done',
                url,
                thumbUrl: isVideo ? '/Logo.svg' : url,
                preview: previewUrl,
                originFileObj: file,
                type: blob.type,
              };

              if (isVideo) {
                return {
                  ...uploadFile,
                  isVideo: true,
                };
              }

              return uploadFile;
            } catch (error) {
              throw error;

              return null;
            }
          }),
        );

        const validFiles = formattedFiles
          .filter((result) => result.status === 'fulfilled' && result.value !== null)
          .map((result) => (result as PromiseFulfilledResult<UploadFile>).value);

        if (validFiles.length === 0) {
          return;
        }

        setFileList((prevFiles) => {
          const existingUrls = prevFiles.map((file) => file.url);
          const newFiles = validFiles.filter((file) => !existingUrls.includes(file.url));

          return [...prevFiles, ...newFiles];
        });
        const currentFormImages = form.getFieldValue('images') || [];

        form.setFieldsValue({
          images: [...currentFormImages, ...validFiles],
        });
      } catch (error) {
        throw error;
      }
    },
    [form, setFileList],
  );

  const constructDocumentList = (documents: documentType[]) => {
    const groupedDocuments = documents.reduce(
      (acc: Record<string, UploadDocInterface[]>, doc: documentType, index: number) => {
        if (!acc[doc.type]) {
          acc[doc.type] = [];
        }
        const constructedData = {
          name: doc.documentName,
          type: getMimeType(doc.documentName || 'documentName'),
          url: doc.documentUrl,
          uid: `uid_${index}`,
          uploadedS3Url: doc.documentUrl,
          isLoading: false,
        };

        acc[doc.type].push(constructedData);

        return acc;
      },
      {} as Record<string, UploadDocInterface[]>,
    );

    setdocList(groupedDocuments);
  };

  const setPriceDetails = (priceHistory: priceHistoryInterface[]) => {
    const priceHistoryList = priceHistory.map((history: priceHistoryInterface, index: number) => ({
      key: index,
      listedDate: history.year,
      price: Number(history.price),
      hasAddedRow: false,
    }));

    setRows(priceHistoryList);
  };

  useEffect(() => {
    if (assetDetail?.response) {
      setDescription(JSON.parse(assetDetail.response.description));
      setCategory(assetDetail?.response?.category?._id);
      setAddress(assetDetail.response.address ?? '');
      form.setFieldsValue({
        name: assetDetail.response.name ?? '',
        description: assetDetail.response.description ? JSON.parse(assetDetail.response.description) : '',
        price: assetDetail.response.price ?? '',
        category: assetDetail.response.category.category,
        country: assetDetail.response.country ?? '',
        state: assetDetail.response.state ?? '',
        address: assetDetail.response.address ?? '',
        postalCode: assetDetail.response.pincode ?? '',
        tokens: assetDetail.response.tokens ?? 1,
        city: assetDetail.response?.city ?? '',
      });

      if (assetDetail.response.priceHistory && assetDetail.response.priceHistory.length > 0) {
        setPriceDetails(assetDetail.response.priceHistory);
      }

      if (assetDetail.response.images && assetDetail.response.images.length > 0) {
        constructImages(assetDetail.response.images);
      }

      if (assetDetail.response.documents && assetDetail.response.documents.length > 0) {
        constructDocumentList(assetDetail.response.documents);
      }
    }
  }, [assetDetail, constructImages, form]);

  const handleNextTab = async () => {
    try {
      let fieldsToValidate: string[] = [];

      switch (activeTab) {
        case '1':
          fieldsToValidate = ['images', 'name', 'category', 'description', 'price'];
          break;
        case '2':
          fieldsToValidate = ['certificates', 'legalHeirCertificate', 'proofOfOwnership'];
          break;
        case '3':
          fieldsToValidate = ['country', 'state', 'address', 'code'];
          break;
        default:
          break;
      }
      await form.validateFields(fieldsToValidate);
      setActiveTab((prevTab) => {
        const nextTab = (parseInt(prevTab, 10) + 1).toString();

        return nextTab <= '4' ? nextTab : prevTab;
      });
    } catch (error) {
      throw error;
    }
  };

  const handleBack = () => {
    if (activeTab === '1') router.replace(`/asset/${assetId}`);

    setActiveTab((prevTab) => {
      const nextTab = (parseInt(prevTab, 10) - 1).toString();

      return nextTab > '0' ? nextTab : prevTab;
    });
  };

  const handleActiveTab = async (key: string) => {
    await form.validateFields();
    setActiveTab(key);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      const categoryData = categoryOptions.find((cat) => cat.value === values.category);

      formData.append('name', values.name);
      formData.append('category', categoryData?.key ?? category);
      formData.append('description', JSON.stringify(description));
      formData.append('price', values.price);
      formData.append('tokens', values.tokens);
      formData.append('country', values.country);
      formData.append('state', values.state);
      formData.append('city', values.city);
      formData.append('address', values.address);
      formData.append('pincode', values.postalCode);

      values.images.forEach((file: { originFileObj: Blob }) => {
        formData.append('images', file.originFileObj);
      });
      const priceHistory = rows.map((row) => ({
        price: row.price,
        year: row.listedDate,
      }));

      formData.append('priceHistory', JSON.stringify(priceHistory));

      formData.set(
        'documents',
        JSON.stringify(
          Object.keys(docList).reduce(
            (updatedDocs, key) => {
              updatedDocs[key] = docList[key].map((doc) => ({
                name: doc?.name ?? 'filename',
                url: doc?.uploadedS3Url ?? '',
              }));

              return updatedDocs;
            },
            {} as Record<string, UpdatedDocsList[]>,
          ),
        ),
      );

      await editAsset({ assetId, data: formData });
      router.replace('/asset/pending-assets');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="d-flex justify-center align-center position-relative flex-column m-y-20">
      <div className="w-80 m-b-16 d-flex self-start m-l-16">
        <button
          className="text-gray-900 cursor-pointer main-button d-flex align-center gap-2"
          onClick={() => router.back()}
        >
          <ChevronLeft className="img-16" />
          <p className="f-14-16-500-o-s">Back</p>
        </button>
      </div>
      <Card className="width-80 p-0 w-800 card">
        <Form form={form} layout="vertical">
          <AntdTabs
            activeTab={activeTab}
            items={[
              {
                key: '1',
                label: <span>Details</span>,
                children: (
                  <EditAssetDetails
                    form={form}
                    fileList={fileList}
                    setFileList={setFileList}
                    setCategory={setCategory}
                    categoryOptions={categoryOptions}
                    description={description}
                    setDescription={setDescription}
                    isTokensSold={!!assetDetail?.response?.soldTokens}
                    assetPrice={assetDetail?.response?.price}
                    assetTokens={assetDetail?.response?.tokens}
                    onTokenError={setHasTokenError}
                  />
                ),
              },
              {
                key: '2',
                label: <span>Documents </span>,
                children: <EditAssetDocument form={form} docList={docList} setDocList={setdocList} />,
              },
              {
                key: '3',
                label: <span>Location </span>,
                children: <EditAssetLocation form={form} address={address} setAddress={setAddress} />,
              },
              {
                key: '4',
                label: <span>Asset History </span>,
                children: <EditAssetHistory form={form} rows={rows} setRows={setRows} />,
              },
            ]}
            onChange={handleActiveTab}
          />
        </Form>
      </Card>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          backgroundColor: 'white',
          padding: '16px',
          borderTop: '1px solid #e8e8e8',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          width: 'calc(100vw - 240px)',
        }}
      >
        {
          <Button type="text" size="large" className="border-brand-color-1" onClick={handleBack}>
            {activeTab === '1' ? 'Cancel' : 'Back'}
          </Button>
        }
        {activeTab === '4' && (
          <Button type="primary" size="large" className="bg-brand-color" onClick={handleSubmit} loading={isLoading}>
            Save changes
          </Button>
        )}
        {activeTab !== '4' && (
          <Button
            type="primary"
            size="large"
            className="bg-brand-color"
            onClick={handleNextTab}
            disabled={
              hasTokenError ||
              Object.values(docList)
                .flat()
                .some((doc) => !doc.uploadedS3Url)
            }
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditAsset;
