/**
 * LiveViewers.jsx — "X people viewing this room right now"
 * Connects to Socket.io, joins the room:${roomId} channel,
 * listens for viewers:count events, shows animated badge.
 */
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const LiveViewers = ({ roomId }) => {
  const [count,    setCount]    = useState(1);
  const [visible,  setVisible]  = useState(false);
  const socketRef  = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
    });

    socket.on('connect', () => {
      socket.emit('watch:room', roomId);
    });

    socket.on('viewers:count', ({ count: c }) => {
      setCount(c);
      setVisible(true);
    });

    socketRef.current = socket;

    return () => {
      socket.emit('leave:room', roomId);
      socket.disconnect();
    };
  }, [roomId]);

  // Only show if more than 1 viewer
  if (!visible || count < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
        style={{
          background: 'rgba(232,0,61,0.10)',
          border: '1px solid rgba(232,0,61,0.25)',
          color: '#E8003D',
        }}
      >
        {/* Pulsing dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: '#E8003D' }} />
          <span className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: '#E8003D' }} />
        </span>
        <span>{count} people viewing this room</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveViewers;
