import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Bookmark, Settings, Info, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Background } from './Background';

const NAV_ITEMS = [
  { path: '/', icon: Compass, label: 'Explore' },
  { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { path: '/documentation', icon: BookOpen, label: 'Docs' },
  { path: '/about', icon: Info, label: 'About' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <Background />
      
      {/* Sidebar Navigation */}
      <nav className="fixed bottom-0 md:bottom-auto md:left-0 md:top-0 w-full md:w-20 md:h-screen z-50 glass-panel border-t md:border-t-0 md:border-r border-[var(--panel-border)] flex md:flex-col items-center justify-between md:justify-center p-4 gap-8">
        <div className="hidden md:flex text-[var(--accent)] mb-auto mt-4">
           {/* Logo placeholder */}
           <div className="w-8 h-8 rounded-full border border-[var(--accent)] flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
           </div>
        </div>

        <div className="flex md:flex-col items-center justify-center w-full md:w-auto gap-6 sm:gap-8 md:gap-10">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => cn(
                "relative flex items-center justify-center p-3 rounded-full transition-all duration-300 group",
                isActive ? "text-[var(--accent)] bg-[rgba(229,193,88,0.1)]" : "text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
              )}
              title={label}
            >
              <Icon size={22} strokeWidth={1.5} />
              {/* Tooltip on desktop */}
              <span className="absolute left-14 px-3 py-1 bg-[rgba(10,11,15,0.9)] border border-[rgba(255,255,255,0.1)] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block uppercase tracking-widest text-[#f0f0f5]">
                {label}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block mt-auto mb-4" />
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full h-[calc(100dvh-80px)] md:h-screen md:ml-20 overflow-y-auto overflow-x-hidden hide-scrollbar pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
    </div>
  );
}
