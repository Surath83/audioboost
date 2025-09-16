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
          d="M80 15C88.2843 15 95 21.7157 95 30V70C95 78.2843 88.2843 85 80 85H20C11.7157 85 5 78.2843 5 70V30C5 21.7157 11.7157 15 20 15H80Z" 
          fill="url(#logo-gradient-bg)"
        />
        <path
          d="M68,25H38C30.82,25,25,30.82,25,38V62C25,69.18,30.82,75,38,75H65V65H38C36.343,65,35,63.657,35,62V38C35,36.343,36.343,35,38,35H68V25Z"
          fill="white"
        />
        <path 
          d="M60 40C58.8954 40 58 40.8954 58 42V51C58 56.5228 53.5228 61 48 61H45C44.4477 61 44 61.4477 44 62V67C44 67.5523 44.4477 68 45 68H48C56.8366 68 64 60.8366 64 52V42C64 40.8954 63.1046 40 62 40H60Z"
          fill="white"
        />
        <path
          d="M58 48C58 44.6863 55.3137 42 52 42C48.6863 42 46 44.6863 46 48V52C46 55.3137 48.6863 58 52 58C55.3137 58 58 55.3137 58 52V48Z"
          fill="white"
        />
        <defs>
          <linearGradient id="logo-gradient-bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(var(--primary))"/>
            <stop offset="1" stopColor="hsl(var(--accent))"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
