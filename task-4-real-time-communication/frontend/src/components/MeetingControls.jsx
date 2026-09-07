import React from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  MonitorUp,
  MonitorOff,
  PenTool,
  MessageSquare,
  Users,
  PhoneOff,
  Settings,
  Sparkles,
} from 'lucide-react';

export default function MeetingControls({
  isAudioMuted,
  isVideoOff,
  isScreenSharing,
  isWhiteboardOpen,
  isChatOpen,
  isParticipantsOpen,
  unreadCount = 0,
  participantCount = 1,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleWhiteboard,
  onToggleChat,
  onToggleParticipants,
  onLeaveMeeting,
}) {
  return (
    <footer className="h-20 bg-slate-900/95 border-t border-slate-800 px-6 flex items-center justify-between z-30 shrink-0">
      {/* Left Meeting Info Pill */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300 font-medium">Encrypted WebRTC</span>
        </div>
      </div>

      {/* Middle Core Media Controls */}
      <div className="flex items-center gap-3">
        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-3.5 rounded-2xl font-semibold transition-all active:scale-95 shadow-lg ${
            isAudioMuted
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30'
              : 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700'
          }`}
          title={isAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={onToggleVideo}
          className={`p-3.5 rounded-2xl font-semibold transition-all active:scale-95 shadow-lg ${
            isVideoOff
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30'
              : 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700'
          }`}
          title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={onToggleScreenShare}
          className={`p-3.5 rounded-2xl font-semibold transition-all active:scale-95 shadow-lg ${
            isScreenSharing
              ? 'bg-indigo-600 text-white border border-indigo-400'
              : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
          title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
        >
          {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <MonitorUp className="w-5 h-5" />}
        </button>

        {/* Whiteboard Toggle */}
        <button
          onClick={onToggleWhiteboard}
          className={`p-3.5 rounded-2xl font-semibold transition-all active:scale-95 shadow-lg flex items-center gap-1.5 ${
            isWhiteboardOpen
              ? 'bg-pink-600 text-white border border-pink-400'
              : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
          title="Interactive Collaborative Whiteboard"
        >
          <PenTool className="w-5 h-5" />
          <span className="hidden md:inline text-xs font-bold">Whiteboard</span>
        </button>

        {/* Leave Call */}
        <button
          onClick={onLeaveMeeting}
          className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-rose-600/30 transition-all active:scale-95 ml-2"
          title="Leave Meeting"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>

      {/* Right Panels & Roster */}
      <div className="flex items-center gap-2">
        {/* Chat Drawer Toggle */}
        <button
          onClick={onToggleChat}
          className={`p-3 rounded-2xl relative transition-all ${
            isChatOpen
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="In-Meeting Chat"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && !isChatOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Participants Drawer Toggle */}
        <button
          onClick={onToggleParticipants}
          className={`p-3 rounded-2xl relative transition-all ${
            isParticipantsOpen
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="Participants Roster"
        >
          <Users className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-indigo-500 text-white text-[9px] font-mono font-bold">
            {participantCount}
          </span>
        </button>
      </div>
    </footer>
  );
}