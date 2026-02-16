import { UserOutlined } from '@ant-design/icons';
import { Avatar as AntAvatar } from 'antd';
import React from 'react';

import { AvatarProps } from './avatar.interface';

import './avatar.module.scss';

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'avatar',
  size = 'default',
  shape = 'circle',
  icon,
  text,
  className = '',
  style = {},
  onClick,
}) => {
  const getAvatarContent = () => {
    if (src) {
      return null;
    } else if (icon) {
      return icon;
    } else if (text) {
      return text.charAt(0).toUpperCase();
    } else {
      return <UserOutlined />;
    }
  };

  const getTextAvatarStyle = () => {
    if (!src && text) {
      const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a', '#722ed1', '#eb2f96'];

      const colorIndex = text.charCodeAt(0) % colors.length;

      return {
        backgroundColor: colors[colorIndex],
        color: '#fff',
        ...style,
      };
    }

    return style;
  };

  return (
    <AntAvatar
      src={src}
      alt={alt}
      size={size}
      shape={shape}
      icon={!src && !text ? icon : undefined}
      className={`custom-avatar ${className}`}
      style={getTextAvatarStyle()}
      onClick={onClick}
    >
      {!src && !icon && text ? getAvatarContent() : null}
    </AntAvatar>
  );
};

export default Avatar;
