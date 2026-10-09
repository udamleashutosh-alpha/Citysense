import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'sample' | 'community' | 'verified' | 'warning' | 'error' | 'success' | 'info';
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, string> = {
  default: 'bg-navy-100 text-navy-700',
  sample: 'bg-amber-100 text-amber-800 border border-amber-200',
  community: 'bg-teal-50 text-teal-700 border border-teal-200',
  verified: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200',
  error: 'bg-red-100 text-red-700 border border-red-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        variantStyles[variant] ?? variantStyles.default
      } ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
    >
      {children}
    </span>
  );
}
