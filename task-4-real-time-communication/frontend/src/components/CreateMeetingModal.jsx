import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Video, Sparkles, Copy, Check } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function CreateMeetingModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [customRoomId, setCustomRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: title || 'Nexus Live Meeting',
        roomId: customRoomId || undefined,
      };
      const { data } = await api.post('/meetings', payload);
      addToast(`Meeting room "${data.roomId}" ready!`);
      navigate(`/room/${data.roomId}`);
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create meeting', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-400" />
            <span>Create New Meeting</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Meeting Topic / Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Product Architecture Review"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Custom Room ID (Optional)
            </label>
            <input
              type="text"
              value={customRoomId}
              onChange={(e) => setCustomRoomId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="e.g. design-sprint"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25"
            >
              {loading ? 'Starting...' : 'Start Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}