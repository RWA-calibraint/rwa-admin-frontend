import { Tabs } from 'antd';
import { ChevronRight } from 'lucide-react';
import React, { ReactNode } from 'react';

interface TabsProps {
  items: TabItem[];
  onChange: (key: string) => void;
  activeTab: string;
}
interface TabItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
}

const AntdTabs: React.FC<TabsProps> = ({ items, onChange, activeTab }) => {
  return (
    <div>
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicator={{ size: (origin) => origin, align: 'center' }}
        moreIcon={<ChevronRight />}
      />
    </div>
  );
};

export default AntdTabs;
