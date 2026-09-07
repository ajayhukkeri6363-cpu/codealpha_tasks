import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Trash2,
  Send,
  MoreHorizontal,
  X,
  Maximize2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Comments inline state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const isOwner = user && post.user?._id === user._id;

  const handleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await api.put(`/posts/${post._id}/like`);
    } catch (err) {
      setIsLiked(!nextState);
      setLikesCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
      toast.error('Could not register like');
    }
  };

  const handleToggleSave = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      const { data } = await api.post(`/saved/${post._id}`);
      toast.success(data.message || (nextSaved ? 'Saved to bookmarks' : 'Removed from bookmarks'));
    } catch (err) {
      setIsSaved(!nextSaved);
      toast.error('Could not save post');
    }
  };

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const { data } = await api.get(`/comments/post/${post._id}`);
        setComments(data.data || []);
      } catch (e) {
        toast.error('Failed to load comments');
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const { data } = await api.post(`/comments/post/${post._id}`, { text: commentText.trim() });
      setComments((prev) => [...prev, data.data]);
      setCommentsCount((c) => c + 1);
      setCommentText('');
      toast.success('Comment posted');
    } catch (err) {
      toast.error(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/explore?search=${encodeURIComponent(post.content.substring(0, 30))}`);
    toast.info('Post link copied to clipboard!');
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      <article className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 space-y-4 shadow-sm hover:border-slate-700 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to={`/profile/${post.user?.username}`} className="flex items-center gap-3 group">
            <img
              src={post.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={post.user?.name}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-rose-500/20 group-hover:scale-105 transition-transform"
            />
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                {post.user?.name}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>@{post.user?.username}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </Link>

          {isOwner && (
            <button
              type="button"
              onClick={() => onDelete(post._id)}
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Delete Post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Text */}
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Hashtag tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/explore?tag=${tag}`}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 px-2.5 py-0.5 rounded-lg border border-rose-500/20"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Media Image with Click-to-Zoom */}
        {post.image && (
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[16/10] max-h-96 cursor-pointer group"
          >
            <img
              src={post.image}
              alt="Post media"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white shadow-lg">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-slate-400">
          <div className="flex items-center gap-4">
            {/* Like button */}
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all active:scale-125 ${
                isLiked ? 'text-rose-500' : 'hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>

            {/* Comment button */}
            <button
              type="button"
              onClick={toggleComments}
              className="flex items-center gap-1.5 text-xs font-bold hover:text-sky-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{commentsCount}</span>
            </button>

            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold hover:text-emerald-400 transition-colors"
              title="Copy link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bookmark button */}
          <button
            type="button"
            onClick={handleToggleSave}
            className={`p-1.5 rounded-xl transition-colors ${
              isSaved ? 'text-amber-400' : 'hover:text-amber-400'
            }`}
            title="Bookmark post"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Expandable Comments Drawer */}
        {showComments && (
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 transition-colors shadow-md shadow-rose-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {loadingComments ? (
              <div className="text-center py-2 text-xs text-slate-500">Loading comments...</div>
            ) : comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-1">No comments yet. Be the first!</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {comments.map((c) => (
                  <div key={c._id} className="flex items-start gap-2.5 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <img
                      src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={c.user?.name}
                      className="w-6 h-6 rounded-lg object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-white mr-1.5">{c.user?.name}</span>
                      <span className="text-slate-300">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </article>

      {/* Lightbox Modal */}
      {isLightboxOpen && post.image && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-800">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={post.image}
              alt="Expanded post preview"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;