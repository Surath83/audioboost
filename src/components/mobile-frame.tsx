"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileFrameProps {
  children: ReactNode;
  className?: string;
}

const MobileFrame = ({ children, className }: MobileFrameProps) => {
  return (
    <div className={cn(
      "relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[10px] rounded-[2.5rem] h-[calc(100vh-4rem)] max-h-[900px] w-full max-w-[450px] shadow-xl",
      className
    )}>
      <div className="w-full h-[28px] bg-gray-800 top-0 rounded-t-[2rem]"></div>
      <div className="absolute top-1/4 left-[-14px] -translate-y-1/2 w-[3px] h-[32px] bg-gray-800 rounded-l-lg"></div>
      <div className="absolute top-1/3 left-[-14px] -translate-y-1/2 w-[3px] h-[32px] bg-gray-800 rounded-l-lg"></div>
      <div className="absolute top-1/4 right-[-14px] -translate-y-1/2 w-[3px] h-[64px] bg-gray-800 rounded-r-lg"></div>
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-background flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default MobileFrame;
