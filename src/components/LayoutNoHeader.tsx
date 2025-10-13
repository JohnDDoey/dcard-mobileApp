'use client';

import { ReactNode } from 'react';
import PersistentGlobe from './PersistentGlobe';

interface LayoutNoHeaderProps {
  children: ReactNode;
}

const LayoutNoHeader: React.FC<LayoutNoHeaderProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Globe uniquement sur Send Money */}
      <div className="absolute inset-0 z-0">
        <PersistentGlobe />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col bg-transparent">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutNoHeader;

