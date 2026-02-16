'use client';

import Dragger from 'antd/es/upload/Dragger';
import Image from 'next/image';
import { FC } from 'react';

import { UploadFileProps } from './upload-file-props';

export const UploadFileComponent: FC<UploadFileProps> = ({ uploadProps }) => {
  return (
    <Dragger {...uploadProps}>
      <div className="d-flex align-center p-y-32 width-100 text-justify justify-center">
        <Image src="/empty-img.png" alt="image" width={52} height={52} />
        <div className="d-flex align-center flex-column m-l-16 max-w-240">
          <p className="f-14-16-600-primary">
            Drag and drop files here or <span className="f-14-16-600-brand-secondary">&nbsp; upload</span>
          </p>
          <p className="f-12-14-400-tertiary m-t-8">Supported file format: .png, .jpeg, .gif Max file limit: 50 MB</p>
        </div>
      </div>
    </Dragger>
  );
};
