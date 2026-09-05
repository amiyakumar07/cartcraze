import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, circle, ...props }) => (
  <div
    className={cn(
      'shimmer rounded-lg',
      circle && 'rounded-full',
      className
    )}
    {...props}
  />
);
