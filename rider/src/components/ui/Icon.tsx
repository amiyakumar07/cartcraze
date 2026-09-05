import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '../../utils/cn';

type IconName = keyof typeof Icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon: React.FC<IconProps> = ({ name, size = 'md', className, ...props }) => {
  const LucideIcon = Icons[name] as React.FC<React.SVGProps<SVGSVGElement>>;
  if (!LucideIcon) return null;

  return (
    <LucideIcon
      width={sizeMap[size]}
      height={sizeMap[size]}
      className={cn('shrink-0', className)}
      {...props}
    />
  );
};
