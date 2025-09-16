import React from 'react';
import { cn } from '@/lib/utils';

interface DhvaniLogoProps extends React.SVGProps<SVGSVGElement> {}

export const DhvaniLogo = ({ className, ...props }: DhvaniLogoProps) => {
  return (
    <div className={cn("p-2 rounded-lg logo-gradient shadow-md", className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        {...props}
      >
        <path
          d="M71.22,15H36.31C24.54,15,15,24.54,15,36.31V63.69C15,75.46,24.54,85,36.31,85H63.69C75.46,85,85,75.46,85,63.69V36.31C85,24.54,75.46,15,63.69,15H71.22Z"
          fill="url(#logo-gradient-fill)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36,25C30.477,25,26,29.477,26,35V65C26,70.523,30.477,75,36,75H52C65.255,75,76,64.255,76,51V49C76,35.745,65.255,25,52,25H36ZM52,35C59.732,35,66,41.268,66,49V51C66,58.732,59.732,65,52,65H36V35H52Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50.2,46.1C47.88,46.1,46,47.98,46,50.3V57.8C46,59.088,46.78,60.2,47.8,60.2H50.2C52.52,60.2,54.4,58.32,54.4,56V50.3C54.4,47.98,52.52,46.1,50.2,46.1ZM50.2,40C44.566,40,40,44.566,40,50.2V56C40,61.634,44.566,66.2,50.2,66.2H51C53.25,66.2,55,67.95,55,70.2V73C55,73.552,55.448,74,56,74H58C58.552,74,59,73.552,59,73V70.2C59,65.68,55.52,62.2,51,62.2H50.2C46.788,62.2,44,59.412,44,56V50.2C44,46.788,46.788,44,50.2,44H51.8V42.1C51.8,40.94,51.06,40,50.2,40Z"
          fill="white"
        />
        <defs>
          <linearGradient id="logo-gradient-fill" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(var(--primary))"/>
            <stop offset="1" stopColor="hsl(var(--accent))"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
