import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Bell,
  Bookmark,
  User,
  LogOut,
  PlusCircle,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Sidebar = ({ onOpenCreate }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Feed', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Bookmarks', path: '/saved', icon: Bookmark },
    { label: 'My Profile', path: `/profile/${user?.username}`, icon: User },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between sticky top-0 h-screen p-4 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="space-y-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                PULSE
              </h1>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block -mt-1">
                Social Media
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Post Trigger Button */}
          {onOpenCreate && (
            <button
              type="button"
              onClick={onOpenCreate}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          )}
        </div>

        {/* User Info & Logout */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <Link to={`/profile/${user?.username}`} className="flex items-center gap-3 min-w-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-rose-500/20 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">@{user?.username}</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 flex items-center justify-around">
        <Link
          to="/"
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 ${
            location.pathname === '/' ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold">Feed</span>
        </Link>
        <Link
          to="/explore"
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 ${
            location.pathname === '/explore' ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[9px] font-bold">Explore</span>
        </Link>
        <Link
          to="/notifications"
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 relative ${
            location.pathname === '/notifications' ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
          <span className="text-[9px] font-bold">Alerts</span>
        </Link>
        <Link
          to="/saved"
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 ${
            location.pathname === '/saved' ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[9px] font-bold">Saved</span>
        </Link>
        <Link
          to={`/profile/${user?.username}`}
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 ${
            location.pathname.startsWith('/profile') ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-bold">Profile</span>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;