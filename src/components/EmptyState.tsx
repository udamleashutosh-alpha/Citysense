import type { ReactNode } from 'react';
import { SearchX, MapPinOff, Inbox, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'search' | 'map' | 'inbox' | 'error';
  title: string;
  description: string;
  action?: ReactNode;
}

const icons = {
  search: SearchX,
  map: MapPinOff,
  inbox: Inbox,
  error: AlertCircle,
};

export default function EmptyState({
  icon = 'search',
  title,
  description,
  action,
}: EmptyStateProps) {
  const Icon = icons[icon];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="mb-4 rounded-2xl bg-navy-50 p-5">
        <Icon size={40} className="text-navy-300" />
      </div>
      <h3 className="text-lg font-semibold text-navy-800 mb-2">{title}</h3>
      <p className="max-w-md text-sm text-navy-400 mb-6">{description}</p>
      {action}
    </div>
  );
}
