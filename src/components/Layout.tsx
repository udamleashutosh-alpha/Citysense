import { useState, type ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import type { PageKey } from '@/types';
import {
  Compass,
  Map,
  ShieldAlert,
  GitCompare,
  Landmark,
  FileText,
  BarChart3,
  Info,
  Menu,
  X,
  Bookmark,
} from 'lucide-react';

interface NavItem {
  key: PageKey;
  label: string;
  icon: typeof Compass;
}

const navItems: NavItem[] = [
  { key: 'discover', label: 'Discover', icon: Compass },
  { key: 'map', label: 'Explore Map', icon: Map },
  { key: 'safety', label: 'Safety', icon: ShieldAlert },
  { key: 'compare', label: 'Compare Places', icon: GitCompare },
  { key: 'heritage', label: 'Heritage', icon: Landmark },
  { key: 'reports', label: 'Community Reports', icon: FileText },
  { key: 'insights', label: 'Insights', icon: BarChart3 },
  { key: 'about', label: 'About / Data', icon: Info },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { page, setPage, bookmarks } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (key: PageKey) => {
    setPage(key);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Top Navigation */}
      <header className="glass-nav sticky top-0 z-40 border-b border-navy-700/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <button
            onClick={() => handleNav('discover')}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 shadow-lg shadow-teal-500/20">
              <Compass size={20} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-display text-lg font-bold leading-none text-sand-50">
                CITY<span className="text-teal-400">SENSE</span>
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-navy-300">
                Pune Explorer
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  page === item.key
                    ? 'bg-teal-500/15 text-teal-300'
                    : 'text-navy-200 hover:bg-navy-800/50 hover:text-sand-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
                {item.key === 'discover' && bookmarks.length > 0 && (
                  <span className="ml-0.5 rounded-full bg-teal-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {bookmarks.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-sand-50 transition-colors hover:bg-navy-800/50 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="animate-slide-down border-t border-navy-700/50 px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    page === item.key
                      ? 'bg-teal-500/15 text-teal-300'
                      : 'text-navy-200 hover:bg-navy-800/50'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                  {item.key === 'discover' && bookmarks.length > 0 && (
                    <span className="ml-auto flex items-center gap-1 text-teal-400">
                      <Bookmark size={12} className="fill-teal-400" />
                      {bookmarks.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-navy-800 bg-navy-900 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-teal-400" />
              <span className="text-sm font-medium text-sand-50">
                CITY<span className="text-teal-400">SENSE</span>
              </span>
              <span className="text-xs text-navy-300">· PromptWars Hackathon</span>
            </div>
            <p className="text-xs text-navy-400">
              Sample data · Not live · No official verification · Made for Pune
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
