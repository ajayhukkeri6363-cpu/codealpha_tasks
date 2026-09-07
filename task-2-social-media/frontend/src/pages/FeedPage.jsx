import React, { useEffect, useState, useCallback } from 'react';
import { PlusCircle, Sparkles, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { StoryBar } from '../components/StoryBar';
import { PostCard } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/posts');
      setPosts(data.data?.posts || []);
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete post');
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      {/* Story Bar */}
      <StoryBar onOpenCreate={() => setIsCreateOpen(true)} />

      {/* Post Creator Prompt Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 flex items-center gap-3 shadow-sm">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
          alt={user?.name}
          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-rose-500/20 shrink-0"
        />
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex-1 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-400 text-left transition-colors"
        >
          Share an update, design, or project...
        </button>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="p-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Your Feed is Quiet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Follow other creators from the right sidebar or publish your first update!
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default FeedPage;
