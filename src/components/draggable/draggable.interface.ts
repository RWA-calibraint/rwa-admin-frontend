import { UploadFile } from 'antd';
import { Dispatch, SetStateAction } from 'react';

export interface DraggableUploadListInterface {
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
}

export interface DragableImageInterface {
  file: UploadFile;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  isFirst: boolean;
  onRemove: (index: number) => void;
}
