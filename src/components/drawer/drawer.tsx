import { Button, Modal } from 'antd';
import { Check, X } from 'lucide-react';
import { SetStateAction, useState } from 'react';

export interface DrawerProps<T = unknown> {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  selectedRows: T[];
  setSelectedRows: React.Dispatch<SetStateAction<T[]>>;
}
const BottomDrawer: React.FC<DrawerProps> = ({ isDrawerOpen, setIsDrawerOpen, selectedRows, setSelectedRows }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleclick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleApprove = () => {
    setSelectedRows([]);
    setIsDrawerOpen(false);
  };

  const handleReject = () => {
    setSelectedRows([]);
    setIsDrawerOpen(false);
  };

  const handleCancel = () => {
    setSelectedRows([]);
    setIsDrawerOpen(false);
  };

  return (
    <div data-state={isDrawerOpen}>
      <div className="d-flex justify-space-between align-center m-y-16 m-l-20">
        <div className="d-flex align-center">
          <div className="border-s-p-1 bg-b-p-c p-x-12 p-y-12 radius-4">
            <p className="f-14-16-500-t-p">
              {selectedRows.length < 10 ? `0${selectedRows.length}` : selectedRows.length}
            </p>
            <p className="f-14-16-500-t-p">
              {selectedRows.length < 10 ? `0${selectedRows.length}` : selectedRows.length}
            </p>
          </div>
          <p className="f-14-16-500-t-p m-l-12">Selected Assets</p>
        </div>
        <div>
          <button onClick={handleCancel} className="border-o-s-s-1 radius-8 p-x-16 p-y-10">
            <p className="f-14-20-500-b-o-s">Cancel</p>
          </button>
          {selectedRows.length < 2 && (
            <button onClick={handleReject} className="bg-b-f-e-d radius-6 d-flex align-center">
              <div className="m-r-8 p-l-16 p-y-12">
                <X className="icon-16-b-f-e" />
              </div>
              <p className="f-14-20-500-b-f-e p-y-10 p-r-16">Reject</p>
            </button>
          )}
          <button onClick={handleclick} className="bg-b-f-i-s-t radius-6 d-flex align-center m-r-16">
            <div className="m-r-8 p-l-16 p-y-12">
              <Check className="icon-16-b-f-e" />
            </div>
            <p className="f-14-20-500-b-f-e p-y-10 p-r-16">{selectedRows.length > 1 ? 'Approve All' : 'Approve'}</p>
          </button>
        </div>
      </div>

      <Modal
        title="Approve All Selected Assets"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => {
              handleApprove();
              setIsOpen(false);
            }}
          >
            Approve All
          </Button>,
        ]}
      >
        <p>Are you sure you want to approve all selected assets</p>
      </Modal>
    </div>
  );
};

export default BottomDrawer;
