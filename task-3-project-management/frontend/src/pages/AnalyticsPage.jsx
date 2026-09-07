import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  Flame,
  TrendingUp,
  PieChart,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics');
      setData(res.data);
    } catch (err) {
      addToast('Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { summary, priorityBreakdown, statusBreakdown } = data;

  const statCards = [
    {
      title: 'Total Active Projects',
      value: summary.totalProjects,
      icon: FolderKanban,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Total Sprint Tasks',
      value: summary.totalTasks,
      icon: BarChart3,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Completion Velocity',
      value: `${summary.completionRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Overdue Work Items',
      value: summary.overdueTasks,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Productivity & Board Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">
          High-level metrics across all active sprints, issue velocity, and priority distribution.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h3 className="text-3xl font-extrabold text-white">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            Task Status Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(statusBreakdown).map(([status, count]) => {
              const percentage = summary.totalTasks > 0 ? Math.round((count / summary.totalTasks) * 100) : 0;
              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">{status}</span>
                    <span className="text-white font-mono">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            Priority Allocation
          </h3>
          <div className="space-y-4">
            {Object.entries(priorityBreakdown).map(([priority, count]) => {
              const percentage = summary.totalTasks > 0 ? Math.round((count / summary.totalTasks) * 100) : 0;
              const barColor =
                priority === 'Urgent'
                  ? 'bg-rose-500'
                  : priority === 'High'
                  ? 'bg-orange-500'
                  : priority === 'Medium'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';

              return (
                <div key={priority} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">{priority} Priority</span>
                    <span className="text-white font-mono">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}