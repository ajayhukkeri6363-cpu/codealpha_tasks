import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Globe,
  Calendar,
  Users,
  Edit3,
  UserPlus,
  UserCheck,
  Grid,
  Bookmark,
  X,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PostCard } from '../components/PostCard';

export const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved'

  // Follower/Following Modal state
  const [modalType, setModalType] = useState(null); // 'followers' | 'following' | null
  const [modalUsers, setModalUsers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Edit Profile Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editCover, setEditCover] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const isOwnProfile = currentUser && currentUser.username === username;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users/profile/${username}`);
      setProfile(data.data);
      setIsFollowing(data.data.isFollowing);
      setFollowersCount(data.data.followersCount);

      if (isOwnProfile) {
        setEditName(data.data.name || '');
        setEditBio(data.data.bio || '');
        setEditLocation(data.data.location || '');
        setEditWebsite(data.data.website || '');
        setEditAvatar(data.data.avatar || '');
        setEditCover(data.data.coverImage || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, [username, isOwnProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    try {
      if (isFollowing) {
        await api.put(`/users/${profile._id}/unfollow`);
        setIsFollowing(false);
        setFollowersCount((c) => Math.max(0, c - 1));
        toast.info(`Unfollowed ${profile.name}`);
      } else {
        await api.put(`/users/${profile._id}/follow`);
        setIsFollowing(true);
        setFollowersCount((c) => c + 1);
        toast.success(`Following ${profile.name}`);
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const openUsersModal = async (type) => {
    setModalType(type);
    setModalLoading(true);
    try {
      const { data } = await api.get(`/users/${profile._id}/${type}`);
      setModalUsers(data.data || []);
    } catch (e) {
      toast.error('Failed to load user list');
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const updated = await updateProfile({
        name: editName,
        bio: editBio,
        location: editLocation,
        website: editWebsite,
        avatar: editAvatar,
        coverImage: editCover,
      });
      setProfile((prev) => ({ ...prev, ...updated }));
      setIsEditOpen(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto w-full space-y-6 animate-pulse">
        <div className="h-48 bg-slate-900/60 rounded-3xl" />
        <div className="h-32 bg-slate-900/60 rounded-3xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-white">User not found</h2>
        <Link to="/" className="text-rose-400 text-xs font-bold mt-2 inline-block">Back to Feed</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      {/* Profile Header Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-44 sm:h-56 bg-slate-800">
          <img
            src={profile.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info row */}
        <div className="p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-4">
            {/* Avatar */}
            <div className="relative w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-slate-950 bg-slate-900 shadow-xl shrink-0">
              <img
                src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Action button */}
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                    isFollowing
                      ? 'bg-slate-800 text-slate-200 hover:bg-rose-950/40 hover:text-rose-400'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" /> Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-black text-white">{profile.name}</h1>
              <p className="text-xs font-semibold text-rose-400">@{profile.username}</p>
            </div>

            {profile.bio && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-medium">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-rose-400 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{profile.website.replace('https://', '')}</span>
                </a>
              )}
            </div>

            {/* Counts */}
            <div className="flex items-center gap-6 pt-3 border-t border-slate-800 text-xs">
              <div>
                <strong className="text-white font-bold">{profile.postsCount || profile.posts?.length || 0}</strong>{' '}
                <span className="text-slate-400">Posts</span>
              </div>
              <button
                type="button"
                onClick={() => openUsersModal('followers')}
                className="hover:underline cursor-pointer"
              >
                <strong className="text-white font-bold">{followersCount}</strong>{' '}
                <span className="text-slate-400">Followers</span>
              </button>
              <button
                type="button"
                onClick={() => openUsersModal('following')}
                className="hover:underline cursor-pointer"
              >
                <strong className="text-white font-bold">{profile.followingCount}</strong>{' '}
                <span className="text-slate-400">Following</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'posts'
              ? 'bg-rose-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Grid className="w-3.5 h-3.5" /> Posts ({profile.posts?.length || 0})
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {profile.posts?.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 text-xs">
            No posts published yet.
          </div>
        ) : (
          profile.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>

      {/* Followers / Following Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base capitalize">{modalType}</h3>
              <button onClick={() => setModalType(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-80 overflow-y-auto space-y-3">
              {modalLoading ? (
                <div className="text-center text-xs text-slate-500 py-4">Loading list...</div>
              ) : modalUsers.length === 0 ? (
                <div className="text-center text-xs text-slate-500 py-4">No users found.</div>
              ) : (
                modalUsers.map((u) => (
                  <Link
                    key={u._id}
                    to={`/profile/${u.username}`}
                    onClick={() => setModalType(null)}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-800/60 transition-colors"
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-500/10"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{u.name}</p>
                      <p className="text-[10px] text-slate-400">@{u.username}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base">Edit Profile</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Website</label>
                  <input
                    type="url"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Avatar URL</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={editCover}
                  onChange={(e) => setEditCover(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
