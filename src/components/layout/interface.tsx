export interface NavProps {
  children: React.ReactNode;
}

export type SideNavButtons =
  | 'Dashoard'
  | 'Pending Assets'
  | 'Approved Assets'
  | 'Rejected Assets'
  | 'User Management'
  | 'Transactions';
