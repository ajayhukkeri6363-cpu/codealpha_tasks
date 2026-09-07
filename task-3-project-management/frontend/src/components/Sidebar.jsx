import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Kanban,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  Sparkles,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export default function Sidebar({ projects = [], onOpenCreateProject }) {
  const navLinks = [
    { name: 'Kanban Board', path: '/', icon: Kanban },
    { name: 'All Projects', path: '/projects', icon: FolderKanban },
    { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-900/40 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        {/* Navigation */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Workspace</p>
          <nav className="space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Quick Project Switcher */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Projects</p>
            {onOpenCreateProject && (
              <button
                onClick={onOpenCreateProject}
                className="text-slate-500 hover:text-indigo-400 transition-colors p-1"
                title="Create Project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="space-y-1">
            {projects.slice(0, 5).map((proj) => (
              <NavLink
                key={proj._id}
                to={`/?project=${proj._id}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: proj.color || '#6366f1' }}
                  />
                  <span className="truncate">{proj.name}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-slate-300">
                  {proj.key}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-800/40 to-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Sync</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Board movements and updates sync instantly over Socket.io across all tabs.
        </p>
      </div>
    </aside>
  );
}