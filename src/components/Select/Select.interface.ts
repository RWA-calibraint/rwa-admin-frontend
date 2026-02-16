interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  placeholder?: string;
  options?: Option[];
  onChange?: (value: string) => void;
  defaultValue?: string;
  allowClear?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "large" | "middle" | "small";
  open: boolean;
  onDropDownChange?: (value: boolean) => void;
}
