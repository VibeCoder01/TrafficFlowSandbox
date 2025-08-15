import * as React from 'react';
import { cn } from '@/lib/utils';

export function TrafficLightIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <rect x="7" y="2" width="10" height="20" rx="2" ry="2" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" className="text-red-500" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" className="text-yellow-500" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" className="text-green-500" />
    </svg>
  );
}
