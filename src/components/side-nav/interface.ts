import { SetStateAction } from "react";

export interface MenuItem {
  key: string;
  icon?: React.ReactElement;
  children?: MenuItem[];
  label?: string;
  href?: string;
}

export interface SidebarProps {
  setTitle: React.Dispatch<SetStateAction<string | undefined>>;
}
