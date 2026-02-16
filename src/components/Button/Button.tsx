import { Button as AntdButton } from 'antd';

import { ButtonProps } from './Button.interface';
import './styles.scss';

const Button: React.FC<ButtonProps & { loading?: boolean }> = ({
  onClick,
  children,
  className = '',
  loading = false,
  type = 'submit',
}) => {
  return (
    <AntdButton
      type="primary"
      htmlType={type}
      onClick={onClick}
      className={`sign-in-button ${className}`}
      disabled={loading}
      loading={loading}
      tabIndex={0}
    >
      {children}
    </AntdButton>
  );
};

export default Button;
