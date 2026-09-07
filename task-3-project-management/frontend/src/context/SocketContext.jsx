import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const getSocketURL = () => {
      if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL.replace(/\/+$/, '');
      }
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '');
      }
      return 'http://localhost:5002';
    };

    const s = io(getSocketURL(), {
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      console.log('[FlowBoard Sockets] Connected to real-time server');
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketContext;