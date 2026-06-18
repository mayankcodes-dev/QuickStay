/**
 * PWAInstallBanner.jsx
 * 
 * A beautiful, dismissible "Add to Home Screen" banner that appears
 * at the bottom of the screen when the browser fires the beforeinstallprompt event.
 * Works on Android Chrome, Edge, desktop Chrome, Samsung Browser.
 * For iOS Safari it shows a manual instruction sheet (iOS doesn't support the API).
 */
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Detect iOS
const isIOS = () =>
  /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) &&
  !window.MSStream;

// Detect if already running in standalone mode (installed)
const isInStandaloneMode = () =>
  ("standalone" in window.navigator && window.navigator.standalone) ||
  window.matchMedia("(display-mode: standalone)").matches;

const DISMISS_KEY = "yoyo_pwa_banner_dismissed";

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSSheet, setShowIOSSheet] = useState(false);
  const [installing, setInstalling] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Don't show if already installed or dismissed recently
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    if (isIOS()) {
      // Delay 4 seconds so user can orient themselves
      timerRef.current = setTimeout(() => setShowBanner(true), 4000);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after 3-second delay
      timerRef.current = setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSSheet(true);
      return;
    }
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } finally {
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  if (!showBanner) return null;

  return (
    <>
      {/* ── Main install banner ── */}
      <AnimatePresence>
        {showBanner && !showIOSSheet && (
          <motion.div
            key="install-banner"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[9990]"
          >
            <div
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: "var(--color-surface-2)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(232,0,61,0.15)",
                border: "1px solid var(--color-border-strong)",
              }}
            >
              {/* App icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: "linear-gradient(135deg,#E8003D,#9B001F)" }}
              >
                🏨
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight mb-0.5" style={{ color: "var(--color-text-primary)" }}>
                  Install YoYo Rooms
                </p>
                <p className="text-xs leading-snug" style={{ color: "var(--color-text-muted)" }}>
                  Add to home screen for fast, offline-ready access
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={handleDismiss}
                  aria-label="Dismiss install banner"
                  className="w-6 h-6 flex items-center justify-center rounded-full text-xs"
                  style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)" }}
                >
                  ✕
                </button>
                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className="btn-primary text-xs py-2 px-4"
                >
                  {installing ? "Installing…" : isIOS() ? "How to Install" : "Install"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── iOS instruction sheet ── */}
      <AnimatePresence>
        {showIOSSheet && (
          <motion.div
            key="ios-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9991] flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.60)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowIOSSheet(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-3xl p-6 pb-10"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "var(--color-border-strong)" }} />

              <h2 className="font-bold text-xl mb-1" style={{ color: "var(--color-text-primary)" }}>
                Add to Home Screen
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Install YoYo Rooms on your iPhone/iPad in 2 steps:
              </p>

              {/* Steps */}
              {[
                { icon: "⬆️", text: "Tap the Share button at the bottom of Safari" },
                { icon: "➕", text: 'Scroll down and tap "Add to Home Screen"' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: "var(--color-surface-3)" }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                      Step {i + 1}
                    </p>
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => { setShowIOSSheet(false); setShowBanner(false); sessionStorage.setItem(DISMISS_KEY, "1"); }}
                className="btn-primary w-full justify-center mt-2"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAInstallBanner;
