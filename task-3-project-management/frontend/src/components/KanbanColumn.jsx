import React, { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';

const columnHeaders = {
  Backlog: { color: 'border-slate-600', dot: 'bg-slate-500' },
  'To Do': { color: 'border-indigo-500', dot: 'bg-indigo-500' },
  'In Progress': { color: 'border-amber-500', dot: 'bg-amber-500' },
  'In Review': { color: 'border-purple-500', dot: 'bg-purple-500' },
  Done: { color: 'border-emerald-500', dot: 'bg-emerald-500' },
};

export default function KanbanColumn({
  column,
  tasks = [],
  onTaskClick,
  onTaskDrop,
  onOpenCreateTask,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && onTaskDrop) {
      onTaskDrop(taskId, column);
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task._id);
  };

  const styling = columnHeaders[column] || { color: 'border-indigo-500', dot: 'bg-indigo-500' };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col w-80 shrink-0 bg-slate-900/40 rounded-2xl border ${
        isDragOver ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800/80'
      } max-h-[calc(100vh-12rem)] transition-all`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${styling.dot}`} />
          <h3 className="font-bold text-sm text-slate-200">{column}</h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-bold text-slate-400 font-mono">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onOpenCreateTask && onOpenCreateTask(column)}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Add task to this column"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List */}
      <div className="p-3 space-y-3 overflow-y-auto flex-1 min-h-[150px]">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDragStart={handleDragStart}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}