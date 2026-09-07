import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Clock,
  CheckCircle2,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import CreateProjectModal from '../components/CreateProjectModal';
import { useToast } from '../context/ToastContext';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      addToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Project Portfolios</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage development streams, milestones, and cross-functional team sprints.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-md"
                    style={{ backgroundColor: proj.color || '#6366f1' }}
                  >
                    {proj.key}
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                    {proj.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-6">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Sprint Completion</span>
                    <span className="text-white font-bold font-mono">{proj.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${proj.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                  <span>
                    <strong className="text-slate-200">{proj.completedTasks || 0}</strong> /{' '}
                    {proj.totalTasks || 0} tasks done
                  </span>
                  <Link
                    to={`/?project=${proj._id}`}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold group/link"
                  >
                    <span>Open Board</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={(newProj) => setProjects([newProj, ...projects])}
        />
      )}
    </div>
  );
}