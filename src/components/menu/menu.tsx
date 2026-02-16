import { Menu as AntdMenu, MenuProps } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

interface MenuProp {
  items: ItemType<MenuItemType>[];
  onClick: MenuProps["onClick"];
  defaultSelectedKeys: string;
}

const Menu: React.FC<MenuProp> = ({ items, onClick, defaultSelectedKeys }) => {
  return (
    <AntdMenu
      className="ant-menu"
      items={items}
      mode="inline"
      onClick={onClick}
      defaultSelectedKeys={[defaultSelectedKeys]}
    />
  );
};

export default Menu;
