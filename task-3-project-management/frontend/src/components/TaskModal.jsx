import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Tag,
  Users,
  CheckSquare,
  MessageSquare,
  Trash2,
  Send,
  Plus,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function TaskModal({ task, onClose, onUpdate, onDelete, users = [] }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [currentTask, setCurrentTask] = useState(task);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCurrentTask(task);
    fetchComments();
  }, [task]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/tasks/${task._id}/comments`);
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { status: newStatus });
      setCurrentTask(data);
      onUpdate(data);
      addToast(`Status updated to ${newStatus}`);
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { priority: newPriority });
      setCurrentTask(data);
      onUpdate(data);
      addToast(`Priority changed to ${newPriority}`);
    } catch (err) {
      addToast('Failed to update priority', 'error');
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    const updatedSubtasks = [
      ...(currentTask.subtasks || []),
      { title: newSubtask.trim(), completed: false },
    ];

    try {
      const { data } = await api.put(`/tasks/${task._id}`, { subtasks: updatedSubtasks });
      setCurrentTask(data);
      onUpdate(data);
      setNewSubtask('');
    } catch (err) {
      addToast('Failed to add subtask', 'error');
    }
  };

  const handleToggleSubtask = async (index) => {
    const updatedSubtasks = [...(currentTask.subtasks || [])];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;

    try {
      const { data } = await api.put(`/tasks/${task._id}`, { subtasks: updatedSubtasks });
      setCurrentTask(data);
      onUpdate(data);
    } catch (err) {
      addToast('Failed to toggle subtask', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post(`/tasks/${task._id}/comments`, { text: newComment });
      setComments((prev) => [...prev, data]);
      setNewComment('');
      addToast('Comment posted');
    } catch (err) {
      addToast('Failed to add comment', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {currentTask.taskKey}
            </span>
            <select
              value={currentTask.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Backlog">Backlog</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
            <select
              value={currentTask.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent Priority</option>
            </select>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{currentTask.title}</h2>
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
              {currentTask.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              Subtasks & Checklists
            </h3>
            <div className="space-y-2">
              {(currentTask.subtasks || []).map((st, idx) => (
                <div
                  key={idx}
                  onClick={() => handleToggleSubtask(idx)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <span
                    className={`text-sm ${
                      st.completed ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Subtask input */}
            <form onSubmit={handleAddSubtask} className="flex gap-2 mt-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask item..."
                className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Add
              </button>
            </form>
          </div>

          {/* Comments Discussion Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Activity & Comments ({comments.length})
            </h3>

            {/* Comment Stream */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c._id} className="flex gap-3 text-xs">
                  <img
                    src={c.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={c.author?.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                  />
                  <div className="flex-1 bg-slate-800/60 border border-slate-800 p-3 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200">{c.author?.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {format(new Date(c.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/25"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDelete(currentTask._id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}