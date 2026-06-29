import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { formatDate, calcNights } from "../utils/helpers";

// ── Theme-aware status badge using CSS vars ───────────────────
const StatusBadge = ({ status }) => {
  const map = {
    paid:      { cls: "badge-success", label: "Confirmed" },
    confirmed: { cls: "badge-success", label: "Confirmed" },
    pending:   { cls: "badge-warning", label: "Pending" },
    cancelled: { cls: "badge-error",   label: "Cancelled" },
  };
  const info = map[status?.toLowerCase()] || { cls: "badge-warning", label: status || "Unknown" };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${info.cls}`}
    >
      {info.label}
    </span>
  );
};

// ── Booking card ───────────────────────────────────────────────────
const BookingCard = ({ booking, index, onCancelled }) => {
  const { currency, axios, getToken } = useAppContext();
  const nights = calcNights(booking.checkInDate, booking.checkOutDate);
  const [paying,    setPaying]    = useState(false);
  const [cancelling,setCancelling]= useState(false);

  const handlePayNow = async () => {
    setPaying(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        '/api/bookings/stripe-payment',
        { bookingId: booking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Could not start payment');
      }
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(true);
    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `/api/bookings/${booking._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message || 'Booking cancelled');
        onCancelled?.(booking._id);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Could not cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const isCancelled = booking.status === 'cancelled';
  const isPaid      = booking.isPaid;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--color-surface-2)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Room image */}
        <div className="sm:w-44 h-44 sm:h-auto shrink-0">
          <img
            src={booking.room?.images?.[0]}
            alt={`${booking.room?.hotel?.name || "Room"}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col gap-4 flex-1">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h3
                className="font-bold text-lg leading-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                {booking.room?.hotel?.name || "Unnamed Hotel"}
              </h3>
              <p
                className="text-sm mt-1 flex items-center gap-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {booking.room?.hotel?.city}, India
              </p>
            </div>
            <StatusBadge status={booking.isPaid ? "paid" : booking.status || "pending"} />
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>Check-In</p>
              <p style={{ color: "var(--color-text-primary)" }}>{formatDate(booking.checkInDate)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>Check-Out</p>
              <p style={{ color: "var(--color-text-primary)" }}>{formatDate(booking.checkOutDate)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>Duration</p>
              <p style={{ color: "var(--color-text-primary)" }}>{nights} night{nights !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Price + Type + Actions */}
          <div
            className="flex items-start justify-between flex-wrap gap-3 pt-4 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div>
              <span className="font-black text-lg" style={{ color: "var(--color-primary)" }}>
                {currency}{(
                  (booking.totalPrice || 0) +
                  (booking.taxAmount  || 0) +
                  (booking.serviceFee || 0) -
                  (booking.discountAmount || 0)
                ).toLocaleString("en-IN")}
              </span>
              <span className="text-xs ml-1" style={{ color: "var(--color-text-muted)" }}>
                total · {nights} night{nights !== 1 ? "s" : ""}
              </span>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {isPaid ? '✅ Paid online' : '🏨 Pay at hotel'}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              {/* Pay Now — only for unpaid, non-cancelled bookings */}
              {!isPaid && !isCancelled && (
                <button
                  onClick={handlePayNow}
                  disabled={paying}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}
                >
                  {paying ? 'Redirecting…' : '💳 Pay Now'}
                </button>
              )}
              {/* Cancel — only for non-cancelled */}
              {!isCancelled && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80 disabled:opacity-50"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)', background: 'var(--color-surface-3)' }}
                >
                  {cancelling ? 'Cancelling…' : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// ── Skeleton loader for bookings ──────────────────────────────
const SkeletonBooking = () => (
  <div
    className="rounded-2xl overflow-hidden flex h-44"
    style={{ background: "var(--color-surface-2)" }}
  >
    <div className="skeleton w-44 h-full" />
    <div className="p-6 flex flex-col gap-4 flex-1">
      <div className="skeleton h-5 w-56 rounded" />
      <div className="skeleton h-4 w-40 rounded" />
      <div className="flex gap-8">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-4 w-24 rounded" />
      </div>
    </div>
  </div>
);

// ── Empty state ───────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-28 text-center">
    <div className="text-6xl mb-6" aria-hidden="true">🏨</div>
    <h2
      className="font-display text-2xl font-bold mb-3"
      style={{ color: "var(--color-text-primary)" }}
    >
      No Bookings Yet
    </h2>
    <p
      className="text-sm mb-8 max-w-xs"
      style={{ color: "var(--color-text-secondary)" }}
    >
      You haven't booked any rooms. Start exploring amazing stays across India.
    </p>
    <Link to="/rooms" className="btn-primary">Browse Hotels</Link>
  </div>
);

// ── Error state ───────────────────────────────────────────────
const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-28 text-center">
    <div className="text-6xl mb-6" aria-hidden="true">⚠️</div>
    <h2
      className="font-display text-2xl font-bold mb-3"
      style={{ color: "var(--color-text-primary)" }}
    >
      Failed to Load Bookings
    </h2>
    <p
      className="text-sm mb-8 max-w-xs"
      style={{ color: "var(--color-text-secondary)" }}
    >
      Something went wrong while fetching your bookings. Check your connection and try again.
    </p>
    <button onClick={onRetry} className="btn-primary">Retry</button>
  </div>
);

// ── Main page ─────────────────────────────────────────────────
const MyBookings = () => {
  const { axios, getToken, user, navigate } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message || "Failed to load bookings");
        setError(true);
      }
    } catch {
      toast.error("Network error — please try again");
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [axios, getToken]);

  useEffect(() => {
    if (!user) { navigate("/login", { state: { from: "/my-bookings" } }); return; }
    fetchBookings();
  }, [user]);

  return (
    <main
      id="main-content"
      className="section-px page-top page-bottom min-h-screen"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: "var(--color-primary)" }}
        >
          Your Account
        </p>
        <h1
          className="font-display text-3xl md:text-4xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          My Bookings
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {loading
            ? "Fetching your trips…"
            : error
            ? "Could not load bookings"
            : `${bookings.length} trip${bookings.length !== 1 ? "s" : ""} found`}
        </p>
      </motion.div>

      <div className="max-w-4xl">
        {/* Loading */}
        {loading && (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => <SkeletonBooking key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && <ErrorState onRetry={fetchBookings} />}

        {/* Empty */}
        {!loading && !error && bookings.length === 0 && <EmptyState />}

        {/* List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-5">
            <AnimatePresence>
              {bookings.map((b, i) => (
                <BookingCard
                  key={b._id}
                  booking={b}
                  index={i}
                  onCancelled={(id) => setBookings(prev => prev.filter(x => x._id !== id))}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBookings;
