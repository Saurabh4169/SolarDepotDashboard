import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Zap, Layers, FolderGit2, User } from 'lucide-react';

export default function BottomNavigation() {
  const navItems = [
    { name: 'Home', path: '/', icon: Home, end: true },
    { name: 'Products', path: '/products', icon: Zap, end: false },
    { name: 'Solutions', path: '/solutions', icon: Layers, end: false, isCenter: true },
    { name: 'Projects', path: '/projects', icon: FolderGit2, end: false },
    { name: 'Profile', path: '/profile', icon: User, end: false },
  ];

  return (
    <nav
      className="sticky bottom-0 z-40 w-full h-16 bg-white/98 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-8px_30px_-4px_rgba(2,151,222,0.22),0_-2px_12px_rgba(2,151,222,0.12),0_-1px_3px_rgba(0,0,0,0.03)] px-1 flex items-center justify-around select-none shrink-0 relative overflow-visible"
      aria-label="Bottom Navigation"
    >
      {/* Ambient #0297DE electric blue top shadow & gradient accent rim */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#0297DE]/60 to-transparent pointer-events-none" />
      <div className="absolute -top-3 inset-x-0 h-3 bg-gradient-to-t from-[#0297DE]/[0.10] to-transparent pointer-events-none blur-sm" />

      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isCenter) {
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className="relative flex flex-col items-center justify-center flex-1 h-full text-center transition-all duration-200 group active:scale-95"
            >
              {({ isActive }) => (
                <>
                  {/* Floating Elevated Center Circle with #0297DE & Cantaloupe multi-layer shadow */}
                  <div className="relative -mt-6 mb-0.5">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-active:scale-95 shadow-[0_8px_24px_-3px_rgba(252,115,77,0.50),0_2px_14px_rgba(2,151,222,0.30)] border-[3.5px] border-white ${
                        isActive
                          ? 'bg-gradient-to-tr from-cantaloupe-600 via-cantaloupe-500 to-[#fd8a6a] ring-2 ring-cantaloupe-400/40'
                          : 'bg-gradient-to-tr from-cantaloupe-600 via-cantaloupe-500 to-[#fd8a6a]'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-white" strokeWidth={2.3} />
                    </div>
                  </div>

                  <span
                    className={`text-[10px] tracking-tight font-bold ${
                      isActive ? 'text-cantaloupe-500' : 'text-slate-600 group-hover:text-cantaloupe-500'
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Active dot indicator */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-all ${
                      isActive ? 'bg-cantaloupe-500 opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                  />
                </>
              )}
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className="relative flex flex-col items-center justify-center flex-1 h-full pt-1 text-center transition-all duration-200 active:scale-95 group"
          >
            {({ isActive }) => (
              <>
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? 'text-cantaloupe-500 scale-110'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                <span
                  className={`text-[10px] tracking-tight mt-1 transition-colors ${
                    isActive
                      ? 'text-cantaloupe-500 font-bold'
                      : 'text-slate-500 group-hover:text-slate-700 font-medium'
                  }`}
                >
                  {item.name}
                </span>

                {/* Active dot indicator matching the design reference */}
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-all ${
                    isActive ? 'bg-cantaloupe-500 opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                />
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
