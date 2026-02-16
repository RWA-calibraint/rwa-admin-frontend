export interface SearchBoxProps {
  placeHolder: string;
  autoFocus?: boolean;
  className?: string;
  onChange: (value: string) => void;
  value?: string;
}
