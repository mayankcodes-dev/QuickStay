/**
 * PWAUpdatePrompt.jsx
 * Shows a toast when a new service worker is available, letting the user
 * reload to get the latest version of the app.
 */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterSW } from "virtual:pwa-register/react";

const PWAUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check for updates every 60 minutes
      r && setInterval(() => r.update(), 60 * 60 * 1000);
    },
  });

  const close = () => setNeedRefresh(false);

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          key="sw-update"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9992] w-full max-w-sm px-4"
        >
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{
              background: "var(--color-surface-2)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.30), 0 4px 12px rgba(232,0,61,0.12)",
              border: "1px solid var(--color-border-strong)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: "var(--color-primary-light)" }}
            >
              🔄
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                Update Available
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                A new version of YoYo Rooms is ready
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={close}
                className="text-xs px-3 py-1.5 rounded-full border"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
              >
                Later
              </button>
              <button
                onClick={() => updateServiceWorker(true)}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Update
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAUpdatePrompt;
