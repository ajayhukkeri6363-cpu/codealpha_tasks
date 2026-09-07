import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, MessageCircle, UserPlus, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setUnreadCount } = useSocket();
  const toast = useToast();

  useEffect(() => {
    api.get('/notifications').then(({ data }) => {
      setNotifications(data.data?.notifications || []);
      setUnreadCount(0);
      // Auto mark read
      api.put('/notifications/read').catch(() => {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, [setUnreadCount]);

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-sky-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Notifications</h1>
          <p className="text-xs text-slate-400">Activity and interactions from your network</p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold">
          {notifications.length} Total
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 text-xs">
          No notifications yet. When people like, comment or follow you, they will appear here!
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <Link to={`/profile/${notif.sender?.username}`} className="shrink-0">
                  <img
                    src={notif.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={notif.sender?.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-500/10"
                  />
                </Link>
                <div>
                  <p className="text-xs text-slate-200">
                    <strong className="text-white">{notif.sender?.name}</strong> {notif.text.replace(notif.sender?.name || '', '').trim()}
                  </p>
                  <span className="text-[10px] text-slate-500">{formatTime(notif.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
