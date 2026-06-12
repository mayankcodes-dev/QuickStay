import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// ── Stat Card ─────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl p-5 flex items-center gap-4"
    style={{ background: 'var(--color-surface-2)', boxShadow: 'var(--shadow-md)' }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
      style={{ background: `${color}20` }}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{title}</p>
      <p className="text-2xl font-bold font-display" style={{ color }}>{value}</p>
    </div>
  </motion.div>
);

// ── Live notification toast component ────────────────────────────
const LiveBookingToast = ({ booking, onClose }) => (
  <motion.div
    initial={{ opacity: 0, x: 60, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 60 }}
    className="flex items-start gap-3 p-4 rounded-2xl shadow-2xl"
    style={{
      background: 'var(--color-surface-2)',
      border: '2px solid #E8003D',
      minWidth: 280, maxWidth: 340,
    }}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
      style={{ background: 'rgba(232,0,61,0.12)' }}>🏨</div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>New Booking!</p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
        {booking?.message || `${booking?.booking?.guests || 1} guest(s) just booked`}
      </p>
      <p className="text-xs mt-1 font-semibold" style={{ color: '#E8003D' }}>Live via Socket.io ⚡</p>
    </div>
    <button onClick={onClose} className="text-sm opacity-50 hover:opacity-100 shrink-0">✕</button>
  </motion.div>
);

const statusColor = s => s === 'confirmed' ? '#16A34A' : s === 'cancelled' ? '#DC2626' : '#D97706';
const statusBg    = s => s === 'confirmed' ? '#DCFCE7' : s === 'cancelled' ? '#FEE2E2' : '#FEF3C7';

const Dashboard = () => {
  const { axios, getToken, user } = useAppContext();
  const [dash,       setDash]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [liveNotifs, setLiveNotifs] = useState([]); // array of live booking payloads
  const socketRef = useRef(null);

  // ── Fetch dashboard data ───────────────────────────────────────
  const fetchDash = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/bookings/hotel', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) setDash(data.dashboardData);
      else toast.error(data.message);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  // ── Update booking status ──────────────────────────────────────
  const updateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId);
    try {
      const { data } = await axios.patch(`/api/bookings/${bookingId}/status`, { status }, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) { toast.success(`Booking ${status}`); fetchDash(); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.message); }
    finally { setUpdatingId(null); }
  };

  // ── Socket.io — join owner notification channel ────────────────
  useEffect(() => {
    fetchDash();

    if (!user?._id) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      socket.emit('join:owner', user._id);
      console.log('[Dashboard] Joined owner notification channel');
    });

    // New booking → show live toast + refresh table
    socket.on('new:booking', (payload) => {
      const id = Date.now();
      setLiveNotifs(prev => [...prev, { id, ...payload }]);
      // Auto-remove after 8 seconds
      setTimeout(() => setLiveNotifs(prev => prev.filter(n => n.id !== id)), 8000);
      // Refresh dashboard data
      fetchDash();
    });

    socketRef.current = socket;
    return () => socket.disconnect();
  }, [user?._id]);

  if (loading) return (
    <div className="p-6 flex flex-col gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
    </div>
  );

  const revenueData = dash?.revenueData?.slice(-14) || [];

  return (
    <div className="p-6 md:p-8">
      {/* ── Live Notification Toasts ───────────────────────────── */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {liveNotifs.map(notif => (
            <div key={notif.id} className="pointer-events-auto">
              <LiveBookingToast
                booking={notif}
                onClose={() => setLiveNotifs(prev => prev.filter(n => n.id !== notif.id))}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--color-text-primary)' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Your hotel performance at a glance</p>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', color: '#16A34A' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Live updates active
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Bookings"  value={dash?.totalBookings || 0}         icon="📋" color="var(--color-primary)" />
        <StatCard title="Total Revenue"   value={`₹${(dash?.totalRevenue || 0).toLocaleString('en-IN')}`} icon="💰" color="#16A34A" />
        <StatCard title="Occupancy Rate"  value={`${dash?.occupancyRate || 0}%`}   icon="🏨" color="#7C3AED" />
        <StatCard title="Avg Booking"     value={dash?.totalBookings ? `₹${Math.round((dash?.totalRevenue || 0) / dash.totalBookings).toLocaleString('en-IN')}` : '₹0'} icon="📊" color="#D97706" />
      </div>

      {/* Revenue Chart */}
      {revenueData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'var(--color-surface-2)', boxShadow: 'var(--shadow-md)' }}
        >
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--color-text-primary)' }}>Revenue — Last 14 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 12 }}
                labelStyle={{ color: 'var(--color-text-primary)', fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#E8003D" strokeWidth={2.5}
                dot={{ fill: '#E8003D', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--color-surface-2)', boxShadow: 'var(--shadow-md)' }}
      >
        <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-surface-3)' }}>
                {['Guest', 'Room', 'Check-In', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(dash?.bookings || []).slice(0, 10).map((b, i) => (
                <tr key={b._id} className="border-t" style={{ borderColor: 'var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-surface-3)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>{b.user?.username || String(b.user).slice(0,8)}…</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>{b.room?.roomType || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>{new Date(b.checkInDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-primary)' }}>₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-1 rounded-full capitalize"
                      style={{ background: statusBg(b.status), color: statusColor(b.status) }}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === 'pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => updateStatus(b._id, 'confirmed')} disabled={updatingId === b._id}
                          className="text-xs px-2 py-1 rounded-lg font-semibold disabled:opacity-50"
                          style={{ background: '#DCFCE7', color: '#16A34A' }}>
                          Confirm
                        </button>
                        <button onClick={() => updateStatus(b._id, 'cancelled')} disabled={updatingId === b._id}
                          className="text-xs px-2 py-1 rounded-lg font-semibold disabled:opacity-50"
                          style={{ background: '#FEE2E2', color: '#DC2626' }}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!dash?.bookings || dash.bookings.length === 0) && (
            <div className="py-16 text-center" style={{ color: 'var(--color-text-muted)' }}>No bookings yet</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
