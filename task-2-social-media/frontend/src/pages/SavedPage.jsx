import React, { useEffect, useState } from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import api from '../services/api';
import { PostCard } from '../components/PostCard';

export const SavedPage = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/saved').then(({ data }) => {
      setSavedPosts(data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" /> Bookmarks & Saved
          </h1>
          <p className="text-xs text-slate-400">Posts you've saved for later reference</p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold">
          {savedPosts.length} Items
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : savedPosts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 text-xs">
          You haven't bookmarked any posts yet. Click the bookmark icon on any post to save it here!
        </div>
      ) : (
        <div className="space-y-5">
          {savedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;
