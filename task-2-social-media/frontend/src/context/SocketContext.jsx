import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      const s = io('/', {
        transports: ['websocket', 'polling'],
      });

      s.on('connect', () => {
        s.emit('join_user', user._id);
      });

      s.on('notification', (notif) => {
        setUnreadCount((c) => c + 1);
        toast.info(notif.text || 'You received a new notification!');
      });

      setSocket(s);

      return () => {
        s.disconnect();
      };
    } else {
      if (socket) socket.disconnect();
      setSocket(null);
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, setUnreadCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
