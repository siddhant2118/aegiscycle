
import React from 'react';
import { cn } from '../lib/utils';
import { Info, AlertCircle, CheckCircle, X } from './Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    style: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
  },
  error: {
    icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
    style: 'bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800 text-rose-800 dark:text-rose-200',
  },
  info: {
    icon: <Info className="h-5 w-5 text-sky-500" />,
    style: 'bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800 text-sky-800 dark:text-sky-200',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const { icon, style } = toastConfig[type];

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border shadow-lg animate-fade-in-right',
        style
      )}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 text-sm font-medium">{message}</div>
      </div>
      <button
        onClick={onDismiss}
        className="ml-4 -mr-1 -mt-1 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;
