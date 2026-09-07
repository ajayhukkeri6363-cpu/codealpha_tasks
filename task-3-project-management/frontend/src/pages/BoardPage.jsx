import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateProjectModal from '../components/CreateProjectModal';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../context/SocketContext';

export default function BoardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectIdParam = searchParams.get('project');
  const { addToast } = useToast();
  const { socket } = useSocket();

  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState('All');

  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskDefaultStatus, setCreateTaskDefaultStatus] = useState('To Do');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [projectIdParam]);

  // Real-time Socket.io listeners
  useEffect(() => {
    if (!socket || !currentProject) return;

    socket.emit('join_project', currentProject._id);

    const handleTaskCreated = (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      if (selectedTask?._id === updatedTask._id) {
        setSelectedTask(updatedTask);
      }
    };

    const handleTaskMoved = ({ taskId, destinationStatus }) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: destinationStatus } : t))
      );
    };

    const handleTaskDeleted = ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (selectedTask?._id === taskId) {
        setSelectedTask(null);
      }
    };

    socket.on('task_created', handleTaskCreated);
    socket.on('task_updated', handleTaskUpdated);
    socket.on('task_moved', handleTaskMoved);
    socket.on('task_deleted', handleTaskDeleted);

    return () => {
      socket.emit('leave_project', currentProject._id);
      socket.off('task_created', handleTaskCreated);
      socket.off('task_updated', handleTaskUpdated);
      socket.off('task_moved', handleTaskMoved);
      socket.off('task_deleted', handleTaskDeleted);
    };
  }, [socket, currentProject, selectedTask]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [projRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/auth/users'),
      ]);

      setProjects(projRes.data);
      setUsers(usersRes.data);

      if (projRes.data.length > 0) {
        const targetProj = projectIdParam
          ? projRes.data.find((p) => p._id === projectIdParam) || projRes.data[0]
          : projRes.data[0];

        await loadProjectDetails(targetProj._id);
      }
    } catch (err) {
      addToast('Failed to load project board', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async (projectId) => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setCurrentProject(data.project);
      setTasks(data.tasks || []);
    } catch (err) {
      addToast('Failed to load project details', 'error');
    }
  };

  const handleProjectSelect = (projId) => {
    setSearchParams({ project: projId });
  };

  const handleTaskDrop = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.post('/tasks/reorder', {
        taskId,
        destinationStatus: newStatus,
        projectId: currentProject._id,
      });
    } catch (err) {
      addToast('Failed to update task position', 'error');
      // Revert if error
      loadProjectDetails(currentProject._id);
    }
  };

  const handleOpenCreateInColumn = (columnStatus) => {
    setCreateTaskDefaultStatus(columnStatus);
    setIsCreateTaskOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setSelectedTask(null);
      addToast('Task deleted successfully');
    } catch (err) {
      addToast('Failed to delete task', 'error');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.labels?.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

    const matchesAssignee =
      selectedAssigneeFilter === 'All' ||
      task.assignees?.some((a) => a._id === selectedAssigneeFilter || a === selectedAssigneeFilter);

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const columns = currentProject?.columns || ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];

  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-[calc(100vh-4rem)] overflow-hidden">
      {/* Project Subheader & Controls */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/30 shrink-0 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: currentProject?.color || '#6366f1' }}
            >
              {currentProject?.key || 'FB'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">
                  {currentProject?.name}
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {currentProject?.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl truncate">
                {currentProject?.description || 'Collaborative workspace board'}
              </p>
            </div>
          </div>

          {/* Project Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={currentProject?._id || ''}
              onChange={(e) => handleProjectSelect(e.target.value)}
              className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.key} - {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              title="New Project"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title, key, or tag..."
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            {/* Assignee Filter */}
            <select
              value={selectedAssigneeFilter}
              onChange={(e) => setSelectedAssigneeFilter(e.target.value)}
              className="bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Assignees</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Showing {filteredTasks.length} tasks</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Horizontal Scroll Container */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
        {columns.map((col) => (
          <KanbanColumn
            key={col}
            column={col}
            tasks={filteredTasks.filter((t) => t.status === col)}
            onTaskClick={(task) => setSelectedTask(task)}
            onTaskDrop={handleTaskDrop}
            onOpenCreateTask={handleOpenCreateInColumn}
          />
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          users={users}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updated) => {
            setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
            setSelectedTask(updated);
          }}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Create Task Modal */}
      {isCreateTaskOpen && currentProject && (
        <CreateTaskModal
          projectId={currentProject._id}
          defaultStatus={createTaskDefaultStatus}
          users={users}
          onClose={() => setIsCreateTaskOpen(false)}
          onCreated={(newTask) => {
            setTasks((prev) => [...prev, newTask]);
          }}
        />
      )}

      {/* Create Project Modal */}
      {isCreateProjectOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateProjectOpen(false)}
          onCreated={(newProj) => {
            setProjects((prev) => [newProj, ...prev]);
            handleProjectSelect(newProj._id);
          }}
        />
      )}
    </div>
  );
}