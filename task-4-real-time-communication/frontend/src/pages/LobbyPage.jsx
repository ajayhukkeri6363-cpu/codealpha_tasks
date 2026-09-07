import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Copy,
  Check,
  Activity,
} from 'lucide-react';
import api from '../services/api';
import CreateMeetingModal from '../components/CreateMeetingModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function LobbyPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [roomIdInput, setRoomIdInput] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const videoPreviewRef = useRef(null);

  useEffect(() => {
    startCameraPreview();
    fetchRecentMeetings();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera/Mic permission not granted or device unavailable:', err.message);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const fetchRecentMeetings = async () => {
    try {
      const { data } = await api.get('/meetings');
      setRecentMeetings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!roomIdInput.trim()) {
      addToast('Please enter a valid room ID', 'error');
      return;
    }
    navigate(`/room/${roomIdInput.trim().toLowerCase()}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time WebRTC Mesh & Collaborative Canvas</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Next-Generation Video Meetings & Whiteboards
        </h1>
        <p className="text-sm md:text-base text-slate-400">
          Connect with team members worldwide with zero plugin downloads, crystal clear audio/video, and interactive drawing boards.
        </p>
      </div>

      {/* Main Grid: Device Setup on Left, Quick Join on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Device Preview Card */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 flex items-center justify-center">
            {!isVideoOff && localStream ? (
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/20"
                />
                <p className="text-xs text-slate-400 font-medium">Camera is turned off</p>
              </div>
            )}

            {/* Quick Toggle Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-xl transition-all ${
                  isAudioMuted
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-xl transition-all ${
                  isVideoOff
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title={isVideoOff ? 'Start Video' : 'Stop Video'}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Connected as <strong className="text-white">{user?.name}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-mono text-slate-400">
                Mic: {!isAudioMuted ? 'Active' : 'Muted'}
              </span>
            </div>
          </div>
        </div>

        {/* Join / Create Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Start New Meeting Button */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-4">
            <h3 className="text-lg font-bold text-white">Start an Instant Meeting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create a secure room instantly with unique link and invite teammates to collaborate with one click.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Room</span>
            </button>
          </div>

          {/* Join with code form */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Join with Room Code</h3>
            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="e.g. design-sprint or eng-sync"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Join Meeting</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Pre-Configured Demo Rooms */}
      <div className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-white">Sample Active Conference Rooms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => navigate('/room/design-sprint')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                Design Sprint & Whiteboard Review
              </h4>
              <p className="text-xs font-mono text-indigo-400">Room: design-sprint</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </div>

          <div
            onClick={() => navigate('/room/eng-sync')}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                Weekly Engineering Architecture Standup
              </h4>
              <p className="text-xs font-mono text-indigo-400">Room: eng-sync</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateMeetingModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}