import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Analytics Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products Inventory', path: '/admin/products', icon: Package },
    { label: 'Orders Management', path: '/admin/orders', icon: ShoppingCart },
    { label: 'User Directory', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 flex flex-col border-r border-slate-800">
        {/* Admin Header */}
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-base tracking-tight">ShopSphere</h2>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                Admin Control
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <Store className="w-5 h-5" />
              <span>Back to Store</span>
            </Link>
          </div>
        </nav>

        {/* Admin User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/30 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-xs text-slate-500">Manage real-time inventory, orders, analytics & users</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" /> View Public Store
            </Link>
          </div>
        </header>

        <main className="p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
