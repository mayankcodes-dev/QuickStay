import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const spinnerVariants = {
  spin: {
    rotate: 360,
    transition: { duration: 0.9, repeat: Infinity, ease: "linear" },
  },
};

// Loader is used as the Stripe success_url target: /loader/:nextUrl
// It verifies the payment, marks the booking as paid, then navigates to nextUrl.
const Loader = () => {
  const { nextUrl } = useParams();
  const { axios, getToken, navigate } = useAppContext();
  const [message, setMessage] = useState("Verifying your payment…");

  useEffect(() => {
    const verify = async () => {
      // The destination path (e.g. "my-bookings")
      const destination = `/${nextUrl || "my-bookings"}`;

      try {
        const token = await getToken();
        if (!token) {
          // Not logged in — just navigate
          navigate(destination, { replace: true });
          return;
        }

        // Get user's bookings to find the most recent unpaid one
        const { data: bookingsData } = await axios.get("/api/bookings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!bookingsData.success) {
          navigate(destination, { replace: true });
          return;
        }

        // Find the most recent booking that isn't yet paid
        const pendingBooking = bookingsData.bookings
          .filter((b) => !b.isPaid && b.status !== "cancelled")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        if (pendingBooking) {
          setMessage("Confirming payment with Stripe…");
          const { data: verifyData } = await axios.post(
            "/api/bookings/verify-payment",
            { bookingId: pendingBooking._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyData.success) {
            setMessage("Payment confirmed! 🎉");
            toast.success("Payment successful! Your booking is confirmed.");
          } else {
            setMessage("Could not verify payment. Redirecting…");
          }
        } else {
          setMessage("All done! Redirecting…");
        }
      } catch {
        // If anything fails, just go to destination silently
        setMessage("Redirecting…");
      }

      // Small delay so user sees the success state
      setTimeout(() => navigate(destination, { replace: true }), 1200);
    };

    verify();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Brand mark */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="mb-6"
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="url(#brandGrad)" />
          <defs>
            <linearGradient id="brandGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E8003D" />
              <stop offset="1" stopColor="#C50030" />
            </linearGradient>
          </defs>
          <text x="32" y="44" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="40" fill="white">Y</text>
        </svg>
      </motion.div>

      {/* Spinner ring */}
      <div className="relative w-12 h-12 mb-4">
        <motion.div
          variants={spinnerVariants}
          animate="spin"
          className="absolute inset-0 rounded-full border-3 border-transparent"
          style={{ borderTopColor: "var(--color-primary)", borderRightColor: "var(--color-primary)" }}
        />
        <div
          className="absolute inset-1 rounded-full"
          style={{ background: "var(--color-surface)" }}
        />
      </div>

      <p className="text-sm font-semibold animate-pulse" style={{ color: "var(--color-primary)" }}>
        {message}
      </p>
    </div>
  );
};

export default Loader;
