import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

const AppBanner = () => {
  const { navigate } = useAppContext();

  // PWA install prompt capture
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled,    setIsInstalled]    = useState(false);
  const [isIOS,          setIsIOS]          = useState(false);
  const [showIOSHint,    setShowIOSHint]    = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
    // iOS detection
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua) && !window.navigator.standalone) {
      setIsIOS(true);
    }
    // Android / Desktop — capture beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) { setShowIOSHint(true); return; }
    if (!deferredPrompt) {
      // Fallback: guide user
      setShowIOSHint(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <section className="py-12 px-4 md:px-16 lg:px-24 xl:px-32">
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 55%, #2A0A1E 100%)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 18% 60%, #FF2D55 0%, transparent 55%),
                              radial-gradient(circle at 82% 20%, #FF9F0A 0%, transparent 45%)`,
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">

          {/* ── Text side ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-white flex-1"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-5"
              style={{ background: "var(--color-primary)", color: "#fff" }}>
              {/* PWA icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
              Free — No App Store Needed
            </span>

            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Book on the <span style={{ color: "var(--color-accent)" }}>Go</span>
            </h2>
            <p className="text-white/70 text-base mb-6 max-w-md leading-relaxed">
              Install YoYo Rooms directly on your phone — no app store, no waiting.
              One tap and it lives on your home screen like a native app.
            </p>

            {/* Perks */}
            <ul className="space-y-2.5 mb-8">
              {[
                "Works offline — browse saved hotels anytime",
                "App-exclusive 15% off on select stays",
                "One-tap check-in & instant notifications",
                "Lightning-fast — native app experience",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-white/80 text-sm">
                  <svg viewBox="0 0 20 20" fill="var(--color-accent)" className="w-4 h-4 shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {/* ── CTA Buttons ────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3">
              {isInstalled ? (
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: "#30D158", color: "#fff" }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  App Installed ✓
                </div>
              ) : (
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: "#FFFFFF", color: "#1A1A2E" }}
                >
                  {/* Download / install icon */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
                    <path d="M12 2v13m0 0l-4-4m4 4l4-4M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] opacity-60 leading-none">Install free</div>
                    <div className="font-bold leading-tight">Download App</div>
                  </div>
                </button>
              )}

              <button
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm border border-white/20 text-white transition-all duration-200 hover:bg-white/10"
                onClick={() => navigate("/rooms")}
              >
                Book via Web →
              </button>
            </div>

            {/* iOS instruction hint */}
            {showIOSHint && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-white/60 text-xs"
              >
                {isIOS
                  ? "On iPhone: tap the Share icon → \"Add to Home Screen\""
                  : "In Chrome: tap ⋮ menu → \"Add to Home screen\" or \"Install app\""}
              </motion.p>
            )}
          </motion.div>

          {/* ── Phone mockup ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex justify-center items-end"
          >
            <div
              className="relative w-52 h-96 rounded-[36px] border-4 overflow-hidden"
              style={{ borderColor: "rgba(255,255,255,0.18)", background: "linear-gradient(180deg, #1A1A2E 0%, #FF2D55 100%)" }}
            >
              {/* Screen */}
              <div className="absolute inset-2 rounded-[28px] overflow-hidden bg-white">
                {/* Status bar */}
                <div className="h-8 flex items-center justify-between px-4" style={{ background: "var(--color-primary)" }}>
                  <span className="text-white text-xs font-bold">YoYo Rooms</span>
                  <div className="flex gap-1">
                    {[1,2,3].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-white/60"/>)}
                  </div>
                </div>
                {/* Hero image */}
                <img
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80"
                  alt="App preview"
                  className="w-full h-40 object-cover"
                />
                {/* Content mock */}
                <div className="p-3 space-y-2">
                  <div className="h-3 rounded-full bg-gray-200 w-3/4"/>
                  <div className="h-2 rounded-full bg-gray-100 w-full"/>
                  <div className="h-2 rounded-full bg-gray-100 w-2/3"/>
                  <div className="mt-3 flex gap-2">
                    <div className="h-8 rounded-lg flex-1" style={{ background: "var(--color-primary)" }}/>
                    <div className="h-8 rounded-lg w-8 bg-gray-100"/>
                  </div>
                  {/* PWA badge on phone screen */}
                  <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 rounded-lg bg-green-50 border border-green-100">
                    <div className="w-3 h-3 rounded-full bg-green-400"/>
                    <span className="text-[9px] text-green-700 font-semibold">PWA — Install Ready</span>
                  </div>
                </div>
              </div>
              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/35"/>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AppBanner;
