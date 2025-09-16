import React from 'react';
import { DhvaniLogo } from './dhvani-logo';

const AppLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background">
      <div className="animate-pulse">
        <DhvaniLogo className="h-24 w-24" />
      </div>
      <p className="mt-4 text-lg font-semibold text-muted-foreground animate-pulse">
        Initializing...
      </p>
    </div>
  );
};

export default AppLoading;
