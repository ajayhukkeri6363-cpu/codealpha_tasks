import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Compass, TrendingUp, Sparkles, Heart, MessageCircle } from 'lucide-react';
import api from '../services/api';
import { PostCard } from '../components/PostCard';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTag = searchParams.get('tag') || '';
  const currentSearch = searchParams.get('search') || '';

  const [posts, setPosts] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [loading, setLoading] = useState(true);

  const fetchExplore = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (currentTag) params.tag = currentTag;
      if (currentSearch) params.search = currentSearch;

      const { data } = await api.get('/posts/explore', { params });
      setPosts(data.data?.posts || []);
      setTrendingTags(data.data?.trendingTags || []);
    } catch (err) {
      console.error('Explore error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentTag, currentSearch]);

  useEffect(() => {
    fetchExplore();
  }, [fetchExplore]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchInput.trim() ? { search: searchInput.trim() } : {});
  };

  const handleTagClick = (tag) => {
    setSearchParams({ tag });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Header & Search */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
          <Compass className="w-4 h-4" /> Explore the Pulse Network
        </div>
        <h1 className="text-2xl font-extrabold text-white">Discover Global Conversations</h1>

        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search keywords, topics, or creators..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-medium"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
        </form>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              !currentTag && !currentSearch
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Trending
          </button>
          {trendingTags.map((t) => (
            <button
              key={t.tag}
              type="button"
              onClick={() => handleTagClick(t.tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                currentTag === t.tag
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              #{t.tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Explore Posts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 text-xs">
          No posts found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
