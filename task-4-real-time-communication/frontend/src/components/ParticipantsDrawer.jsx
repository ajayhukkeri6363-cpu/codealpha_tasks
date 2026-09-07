import React from 'react';
import { X, Mic, MicOff, Video, VideoOff, Crown, Shield } from 'lucide-react';

export default function ParticipantsDrawer({ peers = [], currentUser, hostId, onClose }) {
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full shrink-0 z-20">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-sm text-white">Participants ({1 + peers.length})</h3>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {/* Local user */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-indigo-500"
            />
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                {currentUser?.name} <span className="text-slate-400 font-normal">(You)</span>
              </p>
              <p className="text-[10px] text-indigo-400 font-medium">Participant</p>
            </div>
          </div>
        </div>

        {/* Remote Peers */}
        {peers.map((peer) => (
          <div
            key={peer.socketId}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-800"
          >
            <div className="flex items-center gap-3">
              <img
                src={peer.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                alt={peer.user?.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
              />
              <div>
                <p className="text-xs font-bold text-white">{peer.user?.name || 'Peer'}</p>
                <p className="text-[10px] text-slate-400">Connected</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}