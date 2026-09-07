import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  CheckSquare,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import { format, isPast } from 'date-fns';

const priorityColors = {
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse',
};

export default function TaskCard({ task, onClick, onDragStart }) {
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={onClick}
      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200 cursor-grab active:cursor-grabbing group select-none relative overflow-hidden"
    >
      {/* Priority & Key */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-mono font-bold text-slate-400 tracking-wider">
          {task.taskKey}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              priorityColors[task.priority] || priorityColors.Medium
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
        {task.title}
      </h4>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.labels.map((label, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Subtask Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="mb-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-indigo-400" />
              Checklist
            </span>
            <span>
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                subtaskProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: Due Date & Assignees */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
        {task.dueDate ? (
          <div
            className={`flex items-center gap-1 text-[11px] font-medium ${
              isOverdue ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-600 font-mono">No due date</span>
        )}

        {/* Assignees Avatars */}
        <div className="flex -space-x-1.5">
          {task.assignees && task.assignees.length > 0 ? (
            task.assignees.slice(0, 3).map((assignee, idx) => (
              <img
                key={idx}
                src={assignee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={assignee.name}
                title={assignee.name}
                className="w-5 h-5 rounded-full ring-2 ring-slate-900 object-cover"
              />
            ))
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] text-slate-400">
              ?
            </div>
          )}
        </div>
      </div>
    </div>
  );
}