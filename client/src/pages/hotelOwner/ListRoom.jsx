import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { optimiseImage } from '../../utils/cloudinary';

const AMENITY_OPTIONS = [
  'Free Wi-Fi','Free Breakfast','Room Service','Pool Access','Mountain View',
  'AC','Parking','Gym','Spa','Bar','Restaurant','Laundry','Airport Shuttle',
  'Pet Friendly','TV','Geyser','Mini Bar','King Bed',
];

// ── Inline Edit Form ────────────────────────────────────────
const EditRoomModal = ({ room, onClose, onSaved }) => {
  const { axios, getToken, currency } = useAppContext();
  const [price,     setPrice]     = useState(room.pricePerNight);
  const [amenities, setAmenities] = useState(room.amenities || []);
  const [saving,    setSaving]    = useState(false);

  const toggleAmenity = (a) =>
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await axios.patch(`/api/rooms/${room._id}`, { pricePerNight: price, amenities }, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) { toast.success('Room updated!'); onSaved(); onClose(); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="rounded-2xl p-6 w-full max-w-lg"
        style={{ background: 'var(--color-surface-2)', boxShadow: 'var(--shadow-xl)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            Edit: {room.roomType}
          </h2>
          <button onClick={onClose} className="text-xl font-bold opacity-50 hover:opacity-100" style={{ color: 'var(--color-text-primary)' }}>✕</button>
        </div>

        {/* Price */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Price per Night ({currency})
          </label>
          <input
            type="number" min={100} value={price}
            onChange={e => setPrice(Number(e.target.value))}
            className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
          />
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Amenities
          </label>
          <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
            {AMENITY_OPTIONS.map(a => (
              <button key={a} type="button"
                onClick={() => toggleAmenity(a)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors"
                style={{
                  background: amenities.includes(a) ? 'rgba(232,0,61,0.12)' : 'var(--color-surface-3)',
                  border: `1.5px solid ${amenities.includes(a) ? 'var(--color-primary)' : 'transparent'}`,
                  color: amenities.includes(a) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                }}>
                <span>{amenities.includes(a) ? '✓' : '+'}</span>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
            Cancel
          </button>
          <button onClick={save} disabled={saving}
            className="flex-1 btn-primary py-2.5 rounded-xl text-sm disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Delete confirm ─────────────────────────────────────────
const DeleteConfirm = ({ room, onClose, onDeleted }) => {
  const { axios, getToken } = useAppContext();
  const [deleting, setDeleting] = useState(false);

  const confirm = async () => {
    setDeleting(true);
    try {
      const { data } = await axios.delete(`/api/rooms/${room._id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) { toast.success('Room deleted'); onDeleted(); onClose(); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="rounded-2xl p-6 w-full max-w-sm text-center"
        style={{ background: 'var(--color-surface-2)', boxShadow: 'var(--shadow-xl)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-4xl mb-3">🗑️</div>
        <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>Delete Room?</h3>
        <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
          <strong>{room.roomType}</strong> will be soft-deleted and hidden from guests.
          Existing bookings are unaffected.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
            Cancel
          </button>
          <button onClick={confirm} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
            style={{ background: '#DC2626' }}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main ───────────────────────────────────────────────────
const ListRoom = () => {
  const [rooms,       setRooms]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [editRoom,    setEditRoom]    = useState(null);
  const [deleteRoom,  setDeleteRoom]  = useState(null);
  const { axios, getToken, user, currency } = useAppContext();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/rooms/owner', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) setRooms(data.rooms);
      else toast.error(data.message);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const toggleAvailability = async (roomId) => {
    try {
      const { data } = await axios.post('/api/rooms/toggle-availability', { roomId }, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) { toast.success(data.message); fetchRooms(); }
      else toast.error(data.message);
    } catch (e) { toast.error(e.message); }
  };

  useEffect(() => { user && fetchRooms(); }, [user]);

  const categoryColors = {
    Budget:   { bg: 'rgba(59,130,246,0.10)',  text: '#3B82F6' },
    Premium:  { bg: 'rgba(139,92,246,0.10)',  text: '#8B5CF6' },
    Luxury:   { bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B' },
    Villa:    { bg: 'rgba(16,185,129,0.10)',  text: '#10B981' },
    Business: { bg: 'rgba(232,0,61,0.10)',    text: '#E8003D' },
  };

  return (
    <div>
      {/* Modals */}
      <AnimatePresence>
        {editRoom   && <EditRoomModal   room={editRoom}   onClose={() => setEditRoom(null)}   onSaved={fetchRooms} />}
        {deleteRoom && <DeleteConfirm   room={deleteRoom} onClose={() => setDeleteRoom(null)} onDeleted={fetchRooms} />}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#E8003D' }}>Hotel Owner</p>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
          Room Listings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Manage, edit, and delete your room listings.
        </p>
      </div>

      {/* Counts */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          {rooms.length} room{rooms.length !== 1 ? 's' : ''} listed
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(232,0,61,0.10)', color: '#E8003D' }}>
          {rooms.filter(r => r.isAvailable).length} Available
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ background: 'var(--color-surface-3)' }}>
                {['Room', 'Category', 'Amenities', 'Price/Night', 'Available', 'Actions'].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="py-3 px-4"><div className="skeleton h-4 w-20 rounded" /></td>
                      ))}
                    </tr>
                  ))
                : rooms.length === 0
                  ? (
                      <tr>
                        <td colSpan={6} className="py-14 text-center" style={{ color: 'var(--color-text-muted)' }}>
                          <div className="text-3xl mb-2">🏨</div>
                          <p className="font-semibold">No rooms added yet</p>
                          <p className="text-xs mt-1">Go to Add Room to get started.</p>
                        </td>
                      </tr>
                    )
                  : rooms.map((room, i) => {
                      const cat = categoryColors[room.category] || categoryColors.Budget;
                      return (
                        <motion.tr key={room._id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                          className="border-t group transition-colors hover:bg-white/2"
                          style={{ borderColor: 'var(--color-border)' }}>

                          {/* Room */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={optimiseImage(room.images?.[0], 80)} alt={room.roomType}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                {room.roomType}
                              </span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                              style={{ background: cat.bg, color: cat.text }}>
                              {room.category || 'Budget'}
                            </span>
                          </td>

                          {/* Amenities */}
                          <td className="py-3 px-4 max-w-[180px]">
                            <p className="truncate text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                              {(room.amenities || []).join(' · ') || '—'}
                            </p>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-primary)' }}>
                            {currency}{room.pricePerNight?.toLocaleString('en-IN')}
                          </td>

                          {/* Toggle */}
                          <td className="py-3 px-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer"
                                checked={room.isAvailable}
                                onChange={() => toggleAvailability(room._id)} />
                              <div className="w-11 h-6 rounded-full transition-colors duration-200"
                                style={{ background: room.isAvailable ? '#E8003D' : 'var(--color-surface-3)' }} />
                              <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                                style={{ transform: room.isAvailable ? 'translateX(20px)' : 'translateX(0)' }} />
                            </label>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditRoom(room)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                style={{
                                  background: 'rgba(59,130,246,0.10)',
                                  color: '#3B82F6',
                                  border: '1px solid rgba(59,130,246,0.2)',
                                }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => setDeleteRoom(room)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                style={{
                                  background: 'rgba(220,38,38,0.10)',
                                  color: '#DC2626',
                                  border: '1px solid rgba(220,38,38,0.2)',
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListRoom;
