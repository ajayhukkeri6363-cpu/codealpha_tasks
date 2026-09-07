import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, User, Sparkles } from 'lucide-react';

export default function VideoGrid({ localStream, peers = [], currentUser, isAudioMuted, isVideoOff }) {
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const totalParticipants = 1 + peers.length;
  const gridColumns =
    totalParticipants === 1
      ? 'grid-cols-1'
      : totalParticipants === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : totalParticipants <= 4
      ? 'grid-cols-2'
      : 'grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridColumns} gap-4 p-4 w-full h-full max-h-[calc(100vh-14rem)] overflow-y-auto auto-rows-fr items-center justify-center`}>
      {/* Local User Stream */}
      <div className="relative w-full h-full min-h-[220px] bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl group">
        {!isVideoOff && localStream ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/30"
            />
            <p className="text-sm font-bold text-slate-300">{currentUser?.name} (You)</p>
          </div>
        )}

        {/* Status badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs">
          <span className="font-bold text-white">{currentUser?.name} (You)</span>
          {isAudioMuted ? (
            <MicOff className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </div>
      </div>

      {/* Remote Peer Streams */}
      {peers.map((peer) => (
        <RemotePeerVideo key={peer.socketId} peer={peer} />
      ))}
    </div>
  );
}

function RemotePeerVideo({ peer }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream]);

  return (
    <div className="relative w-full h-full min-h-[220px] bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
      {peer.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <img
            src={peer.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
            alt={peer.user?.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-500/30"
          />
          <p className="text-sm font-bold text-slate-300">{peer.user?.name || 'Remote Colleague'}</p>
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs">
        <span className="font-bold text-white">{peer.user?.name || 'Peer'}</span>
        <Mic className="w-3.5 h-3.5 text-emerald-400" />
      </div>
    </div>
  );
}