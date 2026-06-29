import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | YoYo Rooms</title>
        <meta name="description" content="This page doesn't exist. Head back to YoYo Rooms and find your perfect stay." />
      </Helmet>

      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: "var(--color-surface)" }}
      >
        {/* Ambient blobs */}
        <div
          className="absolute top-1/4 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #E8003D 0%, transparent 70%)", opacity: 0.08 }}
        />
        <div
          className="absolute bottom-1/4 -left-40 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #6C3BD5 0%, transparent 70%)", opacity: 0.07 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-lg relative z-10"
        >
          {/* Giant 404 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 select-none"
          >
            <span
              className="font-display font-black leading-none"
              style={{
                fontSize: "clamp(6rem, 20vw, 10rem)",
                background: "linear-gradient(135deg, #E8003D 0%, #FF4D7A 50%, #6C3BD5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </span>
          </motion.div>

          {/* Emoji */}
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
            className="text-5xl mb-6"
          >
            🏨
          </motion.div>

          {/* Text */}
          <h1
            className="font-display font-bold text-2xl md:text-3xl mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            Room Not Found
          </h1>
          <p
            className="text-sm md:text-base mb-10 leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Looks like this page checked out early. The URL you're looking for
            doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 active:scale-[0.97]"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text-primary)",
                background: "var(--color-surface-2)",
              }}
            >
              ← Go Back
            </button>
            <Link
              to="/"
              className="btn-primary px-6 py-3 rounded-xl text-sm text-center"
            >
              🏠 Back to Home
            </Link>
            <Link
              to="/rooms"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.97] text-center"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)",
              }}
            >
              Browse Rooms
            </Link>
          </div>
        </motion.div>

        {/* Decorative grid lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.3,
          }}
        />
      </div>
    </>
  );
};

export default NotFound;
