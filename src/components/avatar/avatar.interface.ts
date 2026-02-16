export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number | "large" | "small" | "default";
  shape?: "circle" | "square";
  icon?: React.ReactNode;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}
