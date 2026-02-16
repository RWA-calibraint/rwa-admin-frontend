export interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}
