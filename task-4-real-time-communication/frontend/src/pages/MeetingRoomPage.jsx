import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';
import MeetingControls from '../components/MeetingControls';
import Whiteboard from '../components/Whiteboard';
import ChatDrawer from '../components/ChatDrawer';
import ParticipantsDrawer from '../components/ParticipantsDrawer';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function MeetingRoomPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Media States
  const [localStream, setLocalStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Peer Streams
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);

  // UI Panels
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    initMeeting();

    return () => {
      leaveMeeting();
    };
  }, [roomId, socket]);

  const initMeeting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      if (socket) {
        socket.emit('join_room', {
          roomId,
          user: {
            _id: user?._id,
            name: user?.name,
            avatar: user?.avatar,
          },
        });

        socket.on('all_peers', (existingPeers) => {
          setPeers(existingPeers);
          peersRef.current = existingPeers;
        });

        socket.on('peer_joined', ({ socketId, user: peerUser }) => {
          addToast(`${peerUser?.name || 'Someone'} joined the meeting!`, 'info');
          setPeers((prev) => [...prev, { socketId, user: peerUser }]);
        });

        socket.on('peer_left', ({ socketId, user: peerUser }) => {
          addToast(`${peerUser?.name || 'Someone'} left the meeting.`, 'info');
          setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
        });

        socket.on('receive_chat', () => {
          if (!isChatOpen) {
            setUnreadCount((c) => c + 1);
          }
        });
      }
    } catch (err) {
      console.warn('Camera/Mic permission failed:', err.message);
      addToast('Camera or Microphone access required for video call', 'error');
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
        if (socket) {
          socket.emit('media_toggle', { roomId, type: 'audio', enabled: audioTrack.enabled });
        }
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        if (socket) {
          socket.emit('media_toggle', { roomId, type: 'video', enabled: videoTrack.enabled });
        }
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setLocalStream(screenStream);
        setIsScreenSharing(true);

        screenStream.getVideoTracks()[0].onended = () => {
          initMeeting();
          setIsScreenSharing(false);
        };
      } catch (err) {
        console.error('Screen sharing error:', err);
      }
    } else {
      initMeeting();
      setIsScreenSharing(false);
    }
  };

  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden select-none">
      {/* Top Meeting Header */}
      <header className="h-14 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm text-white tracking-tight flex items-center gap-2">
            NEXUS <span className="text-slate-500 font-mono text-xs">/ room: {roomId}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{1 + peers.length} Connected</span>
        </div>
      </header>

      {/* Center Stage: Video Grid OR Whiteboard */}
      <div className="flex-1 flex min-w-0 overflow-hidden relative">
        <main className="flex-1 min-w-0 p-4 flex items-center justify-center relative">
          {isWhiteboardOpen ? (
            <Whiteboard roomId={roomId} onClose={() => setIsWhiteboardOpen(false)} />
          ) : (
            <VideoGrid
              localStream={localStream}
              peers={peers}
              currentUser={user}
              isAudioMuted={isAudioMuted}
              isVideoOff={isVideoOff}
            />
          )}
        </main>

        {/* Slide-in Drawers */}
        {isChatOpen && (
          <ChatDrawer
            roomId={roomId}
            onClose={() => {
              setIsChatOpen(false);
              setUnreadCount(0);
            }}
          />
        )}

        {isParticipantsOpen && (
          <ParticipantsDrawer
            peers={peers}
            currentUser={user}
            onClose={() => setIsParticipantsOpen(false)}
          />
        )}
      </div>

      {/* Bottom Floating Meeting Controls */}
      <MeetingControls
        isAudioMuted={isAudioMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        isWhiteboardOpen={isWhiteboardOpen}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
        unreadCount={unreadCount}
        participantCount={1 + peers.length}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleWhiteboard={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
        onToggleChat={() => {
          setIsChatOpen(!isChatOpen);
          setUnreadCount(0);
        }}
        onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
        onLeaveMeeting={leaveMeeting}
      />
    </div>
  );
}