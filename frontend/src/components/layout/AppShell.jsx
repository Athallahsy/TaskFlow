import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar - responsive behavior handled internally */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Layout */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Mobile top navigation header */}
        <header className="h-16 flex items-center justify-between px-3 bg-surface border-b border-border md:hidden flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-neutral-bg hover:text-text-main transition-colors"
            aria-label="Buka menu navigasi"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <span className="font-brand text-2xl text-text-main font-normal">TaskFlow</span>
          
          {/* Empty spacer to center title if needed */}
          <div className="w-9" />
        </header>

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
