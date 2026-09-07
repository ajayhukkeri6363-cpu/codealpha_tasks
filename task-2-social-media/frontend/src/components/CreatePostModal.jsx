import React, { useState } from 'react';
import { X, Image, Tag, Sparkles, Send } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl.trim()) {
      toast.error('Please write something or add an image');
      return;
    }

    setSubmitting(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().replace('#', ''))
        .filter(Boolean);

      const { data } = await api.post('/posts', {
        content: content.trim(),
        image: imageUrl.trim(),
        tags: parsedTags,
      });

      toast.success('Post shared to your feed!');
      setContent('');
      setImageUrl('');
      setTagsInput('');
      onClose();
      if (onPostCreated) onPostCreated(data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" /> Create New Post
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-500/20"
            />
            <div>
              <p className="text-xs font-bold text-white">{user?.name}</p>
              <p className="text-[10px] text-slate-400">Public Feed</p>
            </div>
          </div>

          <textarea
            rows={4}
            placeholder="What's happening? Share ideas, design concepts, or announcements..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 leading-relaxed"
          />

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-rose-400" /> Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {imageUrl && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-rose-400" /> Hashtags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="design, coding, tech, creative"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <span>Posting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
