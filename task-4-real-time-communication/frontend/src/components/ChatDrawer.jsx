import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Paperclip, Smile, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ChatDrawer({ roomId, onClose }) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveChat = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('receive_chat', handleReceiveChat);

    return () => {
      socket.off('receive_chat', handleReceiveChat);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get(`/meetings/${roomId}/messages`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (socket) {
      socket.emit('send_chat', {
        roomId,
        sender: user?._id,
        senderName: user?.name || 'Anonymous',
        senderAvatar: user?.avatar,
        text: inputText.trim(),
      });
    }

    setInputText('');
  };

  return (
    <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full shrink-0 z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-sm text-white">In-Meeting Chat</h3>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => {
          const isMe = m.sender === user?._id || m.senderName === user?.name;
          return (
            <div
              key={m._id || idx}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                <span className="font-bold text-slate-300">{m.senderName}</span>
                <span>{m.createdAt ? format(new Date(m.createdAt), 'h:mm a') : 'now'}</span>
              </div>
              <div
                className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send a message to everyone..."
          className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}