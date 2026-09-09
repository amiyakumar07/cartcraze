import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'header';
  onClick?: () => void;
  alt?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  onClick,
  alt = 'CartCraze Logo'
}) => {
  const sizeClasses = {
    xs: 'h-6 w-auto max-w-full',
    sm: 'h-9 w-auto max-w-full',
    header: 'h-8 w-auto max-w-full',
    md: 'h-16 w-auto max-w-full',
    lg: 'h-20 w-auto max-w-full',
    xl: 'h-28 w-auto max-w-full'
  };

  const appliedClass = className || sizeClasses[size];

  return (
    <img
      src="/cartcraze_logo.jpg"
      alt={alt}
      onClick={onClick}
      className={`object-contain select-none transition-transform ${onClick ? 'cursor-pointer active:scale-95' : ''} ${appliedClass}`}
      loading="eager"
      decoding="async"
    />
  );
};

export default AppLogo;
