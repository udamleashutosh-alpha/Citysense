import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  icon,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          {icon && <div className="text-teal-500">{icon}</div>}
          <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">{title}</h1>
        </div>
        {subtitle && (
          <p className="mt-1.5 text-sm text-navy-400 sm:text-base">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
