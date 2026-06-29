import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { formatDate, calcNights } from "../utils/helpers";

// ── Theme-aware status badge ───────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    paid:      { cls: "badge-success", label: "Confirmed" },
    confirmed: { cls: "badge-success", label: "Confirmed" },
    pending:   { cls: "badge-warning", label: "Pending" },
    cancelled: { cls: "badge-error",   label: "Cancelled" },
  };
  const info = map[status?.toLowerCase()] || { cls: "badge-warning", label: status || "Unknown" };
  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${info.cls}`}>{info.label}</span>;
};

// ── Cancel Confirmation Modal ──────────────────────────────────
const CancelModal = ({ booking, onConfirm, onClose, loading }) => {
  const hoursUntilCheckIn = (new Date(booking.checkInDate) - Date.now()) / 3600000;
  const refundEligible    = hoursUntilCheckIn >= 48;
  const isPaid            = booking.isPaid;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background:   "var(--color-surface-2)",
          boxShadow:    "var(--shadow-xl)",
          border:       "1px solid var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 mx-auto"
          style={{ background: "rgba(239,68,68,0.12)" }}>
          🚫
        </div>

        <h2 className="font-display font-bold text-xl text-center mb-2"
          style={{ color: "var(--color-text-primary)" }}>
          Cancel Booking?
        </h2>
        <p className="text-sm text-center mb-6"
          style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-text-primary)" }}>
            {booking.room?.hotel?.name}
          </strong>{" "}
          · Check-in {formatDate(booking.checkInDate)}
        </p>

        {/* Policy box */}
        <div className="rounded-2xl p-5 mb-6 space-y-3"
          style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
          <p className="text-xs font-bold uppercase tracking-wide"
            style={{ color: "var(--color-text-muted)" }}>
            Cancellation &amp; Refund Policy
          </p>

          {/* Refund eligibility */}
          <div className={`flex items-start gap-3 rounded-xl p-3 ${refundEligible ? "" : ""}`}
            style={{
              background: refundEligible ? "rgba(22,163,74,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${refundEligible ? "rgba(22,163,74,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}>
            <span className="text-lg shrink-0">{refundEligible ? "✅" : "⚠️"}</span>
            <div>
              <p className="text-sm font-semibold"
                style={{ color: refundEligible ? "#16A34A" : "#DC2626" }}>
                {refundEligible ? "Full Refund Eligible" : "No Refund Available"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                {refundEligible
                  ? "Your check-in is more than 48 hours away. You qualify for a full refund."
                  : "Your check-in is within 48 hours. Cancellations within this window are non-refundable."}
              </p>
            </div>
          </div>

          {/* Payment info */}
          {isPaid && refundEligible && (
            <div className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <span className="text-lg shrink-0">💳</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#6366F1" }}>
                  Refund Timeline
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                  The full amount will be refunded to your original payment method within <strong>5–7 business days</strong>.
                </p>
              </div>
            </div>
          )}

          {!isPaid && (
            <div className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              <span className="text-lg shrink-0">🏨</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Pay at Hotel Booking
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                  You haven't paid yet. No charge will be made if you cancel.
                </p>
              </div>
            </div>
          )}

          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Once cancelled, this booking cannot be restored. You can make a new booking at any time.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{
              borderColor: "var(--color-border-strong)",
              color:       "var(--color-text-primary)",
              background:  "var(--color-surface-3)",
            }}
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#DC2626", color: "#fff" }}
          >
            {loading ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Booking card ───────────────────────────────────────────────
const BookingCard = ({ booking, index, onCancelled }) => {
  const { currency, axios, getToken } = useAppContext();
  const nights = calcNights(booking.checkInDate, booking.checkOutDate);
  const [paying,      setPaying]      = useState(false);
  const [cancelling,  setCancelling]  = useState(false);
  const [showModal,   setShowModal]   = useState(false);

  const isCancelled = booking.status === "cancelled";
  const isPaid      = booking.isPaid;

  const handlePayNow = async () => {
    setPaying(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/bookings/stripe-payment",
        { bookingId: booking._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Could not start payment");
      }
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // ✅ FIXED: use PATCH /:id/cancel (not DELETE)
  const handleCancelConfirm = async () => {
    setCancelling(true);
    try {
      const token = await getToken();
      const { data } = await axios.patch(
        `/api/bookings/${booking._id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message || "Booking cancelled successfully");
        setShowModal(false);
        onCancelled?.(booking._id);
      } else {
        toast.error(data.message || "Could not cancel booking");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, duration: 0.4 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--color-surface-2)",
          boxShadow:  "var(--shadow-md)",
          border:     "1px solid var(--color-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Room image */}
          <div className="sm:w-44 h-44 sm:h-auto shrink-0">
            <img
              src={booking.room?.images?.[0]}
              alt={booking.room?.hotel?.name || "Room"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col gap-4 flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-lg leading-tight"
                  style={{ color: "var(--color-text-primary)" }}>
                  {booking.room?.hotel?.name || "Unnamed Hotel"}
                </h3>
                <p className="text-sm mt-1 flex items-center gap-1"
                  style={{ color: "var(--color-text-secondary)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
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
                <p className="text-xs font-bold uppercase tracking-wide mb-1"
                  style={{ color: "var(--color-text-muted)" }}>Check-In</p>
                <p style={{ color: "var(--color-text-primary)" }}>{formatDate(booking.checkInDate)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1"
                  style={{ color: "var(--color-text-muted)" }}>Check-Out</p>
                <p style={{ color: "var(--color-text-primary)" }}>{formatDate(booking.checkOutDate)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1"
                  style={{ color: "var(--color-text-muted)" }}>Duration</p>
                <p style={{ color: "var(--color-text-primary)" }}>{nights} night{nights !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* Price + Actions */}
            <div className="flex items-start justify-between flex-wrap gap-3 pt-4 border-t"
              style={{ borderColor: "var(--color-border)" }}>
              <div>
                <span className="font-black text-lg" style={{ color: "var(--color-primary)" }}>
                  ₹{(
                    (booking.totalPrice    || 0) +
                    (booking.taxAmount     || 0) +
                    (booking.serviceFee    || 0) -
                    (booking.discountAmount|| 0)
                  ).toLocaleString("en-IN")}
                </span>
                <span className="text-xs ml-1" style={{ color: "var(--color-text-muted)" }}>
                  total · {nights} night{nights !== 1 ? "s" : ""}
                </span>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {isPaid ? "✅ Paid online" : "🏨 Pay at hotel"}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                {!isPaid && !isCancelled && (
                  <button
                    onClick={handlePayNow}
                    disabled={paying}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--color-primary)", color: "#fff" }}
                  >
                    {paying ? "Redirecting…" : "💳 Pay Now"}
                  </button>
                )}
                {!isCancelled && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                    style={{
                      borderColor: "var(--color-border)",
                      color:       "var(--color-text-secondary)",
                      background:  "var(--color-surface-3)",
                    }}
                  >
                    Cancel
                  </button>
                )}
                {isCancelled && (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#DC2626" }}>
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {showModal && (
          <CancelModal
            booking={booking}
            loading={cancelling}
            onConfirm={handleCancelConfirm}
            onClose={() => !cancelling && setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ── Skeleton loader ────────────────────────────────────────────
const SkeletonBooking = () => (
  <div className="rounded-2xl overflow-hidden flex h-44"
    style={{ background: "var(--color-surface-2)" }}>
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

// ── Empty state ────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-28 text-center">
    <div className="text-6xl mb-6" aria-hidden="true">🏨</div>
    <h2 className="font-display text-2xl font-bold mb-3"
      style={{ color: "var(--color-text-primary)" }}>No Bookings Yet</h2>
    <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
      You haven't booked any rooms. Start exploring amazing stays across India.
    </p>
    <Link to="/rooms" className="btn-primary">Browse Hotels</Link>
  </div>
);

// ── Error state ────────────────────────────────────────────────
const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-28 text-center">
    <div className="text-6xl mb-6" aria-hidden="true">⚠️</div>
    <h2 className="font-display text-2xl font-bold mb-3"
      style={{ color: "var(--color-text-primary)" }}>Failed to Load Bookings</h2>
    <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
      Something went wrong. Check your connection and try again.
    </p>
    <button onClick={onRetry} className="btn-primary">Retry</button>
  </div>
);

// ── Main page ──────────────────────────────────────────────────
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
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: "var(--color-primary)" }}>Your Account</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold"
          style={{ color: "var(--color-text-primary)" }}>My Bookings</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {loading
            ? "Fetching your trips…"
            : error
            ? "Could not load bookings"
            : `${bookings.length} trip${bookings.length !== 1 ? "s" : ""} found`}
        </p>
      </motion.div>

      <div className="max-w-4xl">
        {loading && (
          <div className="space-y-5">{[1, 2, 3].map((i) => <SkeletonBooking key={i} />)}</div>
        )}
        {!loading && error  && <ErrorState onRetry={fetchBookings} />}
        {!loading && !error && bookings.length === 0 && <EmptyState />}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-5">
            <AnimatePresence>
              {bookings.map((b, i) => (
                <BookingCard
                  key={b._id}
                  booking={b}
                  index={i}
                  onCancelled={(id) =>
                    setBookings((prev) =>
                      prev.map((x) => x._id === id ? { ...x, status: "cancelled" } : x)
                    )
                  }
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
