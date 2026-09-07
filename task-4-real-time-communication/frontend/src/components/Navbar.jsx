import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Sparkles, LogOut, Plus, ShieldCheck, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenCreateMeeting }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
              NEXUS
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">LIVE</span>
            </span>
            <p className="text-[10px] text-slate-400 -mt-1 font-medium">Meet • Collaborate • Create</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {onOpenCreateMeeting && (
          <button
            onClick={onOpenCreateMeeting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Meeting</span>
          </button>
        )}

        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name}
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-200 leading-none">{user?.name}</p>
            <p className="text-[10px] text-emerald-400 font-medium leading-none mt-1">● Online</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}