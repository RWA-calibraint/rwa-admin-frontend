import { InputProps } from "./Input.interface";

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  name,
  required = false,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      name={name}
      required={required}
    />
  );
};

export default Input;
