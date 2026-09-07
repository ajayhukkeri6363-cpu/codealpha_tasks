import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, UserPlus, Check, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const TrendingSidebar = () => {
  const [suggested, setSuggested] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [followingMap, setFollowingMap] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load suggestions & trending
    api.get('/users/suggested').then(({ data }) => setSuggested(data.data || [])).catch(() => {});
    api.get('/posts/explore').then(({ data }) => {
      if (data.data?.trendingTags) setTrendingTags(data.data.trendingTags);
    }).catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFollowToggle = async (userId, name) => {
    const isCurrentlyFollowing = !!followingMap[userId];
    try {
      if (isCurrentlyFollowing) {
        await api.put(`/users/${userId}/unfollow`);
        setFollowingMap((prev) => ({ ...prev, [userId]: false }));
        toast.info(`Unfollowed ${name}`);
      } else {
        await api.put(`/users/${userId}/follow`);
        setFollowingMap((prev) => ({ ...prev, [userId]: true }));
        toast.success(`Now following ${name}`);
      }
    } catch (err) {
      toast.error(err.message || 'Follow action failed');
    }
  };

  return (
    <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-6 p-4 sticky top-0 h-screen overflow-y-auto">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          placeholder="Search Pulse creators, posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
      </form>

      {/* Suggested Creators Card */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Creators to Follow
        </h3>

        <div className="space-y-3">
          {suggested.map((u) => {
            const isFollowing = followingMap[u._id];

            return (
              <div key={u._id} className="flex items-center justify-between gap-3">
                <Link to={`/profile/${u.username}`} className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-rose-500/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate hover:text-rose-400 transition-colors">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">@{u.username}</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => handleFollowToggle(u._id, u.name)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all shrink-0 ${
                    isFollowing
                      ? 'bg-slate-800 text-slate-300 hover:bg-rose-950/40 hover:text-rose-400'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Topics Card */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-rose-400" /> Trending Topics
        </h3>

        <div className="flex flex-wrap gap-2 pt-1">
          {trendingTags.length === 0 ? (
            ['design', 'technology', 'photography', 'webrtc', 'future', 'lifestyle'].map((t) => (
              <Link
                key={t}
                to={`/explore?tag=${t}`}
                className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-rose-500/10 border border-slate-700/60 hover:border-rose-500/30 text-xs font-semibold text-slate-300 hover:text-rose-400 transition-colors"
              >
                #{t}
              </Link>
            ))
          ) : (
            trendingTags.map((tag) => (
              <Link
                key={tag.tag}
                to={`/explore?tag=${tag.tag}`}
                className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-rose-500/10 border border-slate-700/60 hover:border-rose-500/30 text-xs font-semibold text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-1.5"
              >
                <span>#{tag.tag}</span>
                <span className="text-[10px] text-slate-500 font-normal">({tag.count})</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default TrendingSidebar;
