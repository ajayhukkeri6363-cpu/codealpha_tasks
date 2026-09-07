import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StoryBar = ({ onOpenCreate }) => {
  const { user } = useAuth();

  const mockStories = [
    { name: 'Elena', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', active: true },
    { name: 'Leo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', active: true },
    { name: 'Maya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', active: true },
    { name: 'Liam', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', active: false },
    { name: 'Sofia', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', active: true },
  ];

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4 overflow-x-auto flex items-center gap-4">
      {/* Add Story Pill */}
      <button
        type="button"
        onClick={onOpenCreate}
        className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
      >
        <div className="relative w-14 h-14 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center group-hover:border-rose-500 transition-colors">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt="You"
            className="w-full h-full object-cover rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
            <Plus className="w-3 h-3" />
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[60px]">Your Story</span>
      </button>

      {/* Other Stories */}
      {mockStories.map((story, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div
            className={`p-0.5 rounded-2xl transition-transform duration-300 group-hover:scale-105 ${
              story.active
                ? 'bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400'
                : 'bg-slate-700'
            }`}
          >
            <div className="w-13 h-13 rounded-2xl p-0.5 bg-slate-950">
              <img
                src={story.avatar}
                alt={story.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
            </div>
          </div>
          <span className="text-[10px] font-medium text-slate-300 truncate max-w-[60px]">{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default StoryBar;
