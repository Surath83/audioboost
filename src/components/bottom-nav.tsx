"use client";

import React from 'react';
import { Home, SlidersHorizontal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Tab = 'home' | 'tuning' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tuning', label: 'Tuning', icon: SlidersHorizontal },
  { id: 'profile', label: 'Profile', icon: User },
] as const;


const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  return (
    <div className="flex justify-around items-center p-2 bg-card border-t border-border">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => setActiveTab(item.id)}
          className={cn(
            "flex flex-col items-center justify-center h-16 w-20 rounded-lg transition-colors duration-200",
            activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <item.icon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default BottomNav;
