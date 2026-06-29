import { useState } from "react";
import { motion } from "framer-motion";
import { cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const CLOUD = "dgqgzmzed";

// ── Video sources
const HERO_VIDEO     = "https://res.cloudinary.com/dgqgzmzed/video/upload/v1782728427/hero_video_main_teqgjw.mp4";
const HERO_VIDEO_ALT = "https://res.cloudinary.com/dgqgzmzed/video/upload/v1782646953/hero_video_alt_bjksts.mp4";

// ── Static fallback (shown on mobile + while video loads on desktop)
// Uses a wide hero hotel image — swap to your own poster after uploading
const FALLBACK_POSTER = `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill,g_auto/yoyo/assets/hero_image`;


const trustBadges = [
  { icon: "🏨", label: "10,000+", sub: "Hotels" },
  { icon: "😊", label: "1M+",     sub: "Guests" },
  { icon: "⚡", label: "Instant", sub: "Booking" },
  { icon: "💰", label: "Best",    sub: "Prices" },
  { icon: "⭐", label: "4.8/5",   sub: "Rated" },
  { icon: "🛡️", label: "100%",   sub: "Secure" },
];

// ── Input field wrapper
const SearchField = ({ label, icon, borderRight = true, children }) => (
  <div
    className="flex flex-col px-5 py-4"
    style={{
      borderRight: borderRight ? "1px solid rgba(0,0,0,0.07)" : "none",
      minWidth: 0,
      flex: 1,
    }}
  >
    <label
      className="text-[10px] font-black uppercase tracking-widest mb-1"
      style={{ color: "#E8003D" }}
    >
      {icon} {label}
    </label>
    {children}
  </div>
);

// ── Guests stepper (reuses SearchField wrapper)
const GuestsField = ({ guests, setGuests }) => (
  <SearchField label="Guests" icon="👤" borderRight>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setGuests(g => Math.max(1, g - 1))}
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition hover:bg-gray-100"
        style={{ color: "#E8003D", border: "1px solid rgba(232,0,61,0.3)" }}
      >−</button>
      <span className="text-sm font-bold text-gray-800 w-4 text-center">{guests}</span>
      <button
        type="button"
        onClick={() => setGuests(g => Math.min(10, g + 1))}
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition hover:bg-gray-100"
        style={{ color: "#E8003D", border: "1px solid rgba(232,0,61,0.3)" }}
      >+</button>
    </div>
  </SearchField>
);

const Hero = () => {
  const { navigate, getToken, axios, setSearchedCities } = useAppContext();
  const [destination, setDestination] = useState("");
  const [checkIn,     setCheckIn]     = useState("");
  const [checkOut,    setCheckOut]    = useState("");
  const [guests,      setGuests]      = useState(1);

  const today    = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const onSearch = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (checkIn)     params.set("checkIn",     checkIn);
    if (checkOut)    params.set("checkOut",     checkOut);
    if (guests > 1)  params.set("guests",       guests);
    navigate("/rooms?" + params.toString());
    try {
      const token = await getToken();
      if (token && destination) {
        await axios.post(
          "/api/user/store-recent-search",
          { recentSearchedCity: destination },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchedCities((prev) => {
          const updated = [...prev.filter((c) => c !== destination), destination];
          return updated.slice(-3);
        });
      }
    } catch (_) { /* silent */ }
  };

  return (
    <section className="relative w-full h-screen min-h-[640px] overflow-hidden -mt-16">

      {/* ── Background — Desktop: video / Mobile: static image ──── */}

      {/* Mobile background (< md) — static Cloudinary image, no video */}
      <div
        className="md:hidden absolute inset-0 w-full h-full"
        style={{
          background: `url(${FALLBACK_POSTER}) center/cover no-repeat`,
        }}
      />

      {/* Desktop background (≥ md) — autoplay video */}
      <video
        className="hidden md:block absolute inset-0 w-full h-full object-cover scale-105"
        autoPlay muted loop playsInline
        poster={FALLBACK_POSTER}
      >
        <source src={HERO_VIDEO}     type="video/mp4" />
        <source src={HERO_VIDEO_ALT} type="video/mp4" />
      </video>

      {/* ── Multi-layer cinematic overlay ─────────────────── */}
      {/* Base dark layer */}
      <div className="absolute inset-0" style={{ background: "rgba(5,5,15,0.52)" }} />
      {/* Bottom-heavy gradient for search bar readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(5,5,20,0.40) 40%, rgba(5,5,20,0.75) 70%, rgba(5,5,20,0.90) 100%)",
        }}
      />
      {/* Top vignette so navbar blends */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 25%)",
        }}
      />
      {/* Subtle red atmospheric glow from bottom-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 20% 110%, rgba(232,0,61,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">

        {/* Platform badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
          style={{
            background: "rgba(232,0,61,0.15)",
            border: "1px solid rgba(232,0,61,0.45)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ color: "#FF4570" }}>★</span>
          <span
            className="text-xs font-bold tracking-[0.12em] uppercase"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            India's Fastest Growing Hotel Platform
          </span>
        </motion.div>

        {/* ── Main headline ──────────────────────────────── */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold text-white leading-[1.02] mb-4 max-w-4xl"
          style={{
            fontSize: "clamp(2.4rem, 7vw, 5.2rem)",
            letterSpacing: "-0.035em",
            textShadow: "0 2px 40px rgba(0,0,0,0.6)",
          }}
        >
          Your Perfect Stay,
          <br />
          <span style={{ color: "#FF3B6B" }}>One Click</span>
          {" "}Away
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg max-w-md mb-10 leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.72)",
            textShadow: "0 1px 12px rgba(0,0,0,0.5)",
          }}
        >
          Budget to luxury — 10,000+ verified hotels across India.
          Book instantly, pay your way.
        </motion.p>

        {/* ── Search bar ─────────────────────────────────── */}
        <motion.form
          initial={{ opacity: 0, y: 36, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={onSearch}
          className="w-full max-w-4xl"
          style={{
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(32px) saturate(200%)",
            WebkitBackdropFilter: "blur(32px) saturate(200%)",
            borderRadius: "20px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          <div className="flex flex-col md:flex-row items-stretch">

            {/* Destination */}
            <SearchField label="Where to?" icon="📍" borderRight>
              <input
                list="yoyo-destinations"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Mumbai, Goa, Jaipur…"
                required
                className="bg-transparent text-sm font-semibold outline-none w-full placeholder:text-gray-400 placeholder:font-normal"
                style={{ color: "#0D0D1A" }}
              />
              <datalist id="yoyo-destinations">
                {cities.map((c, i) => <option key={i} value={c} />)}
              </datalist>
            </SearchField>

            {/* Check-in */}
            <SearchField label="Check In" icon="📅" borderRight>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-sm font-semibold outline-none w-full"
                style={{ color: checkIn ? "#0D0D1A" : "#9ca3af" }}
              />
            </SearchField>

            {/* Check-out */}
            <SearchField label="Check Out" icon="📅" borderRight>
              <input
                type="date"
                min={checkIn || tomorrow}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-sm font-semibold outline-none w-full"
                style={{ color: checkOut ? "#0D0D1A" : "#9ca3af" }}
              />
            </SearchField>

            {/* Guests */}
            <GuestsField guests={guests} setGuests={setGuests} />

            {/* Search CTA */}
            <div className="flex items-center p-3">
              <button
                type="submit"
                className="flex items-center gap-2.5 font-bold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-100"
                style={{
                  background: "linear-gradient(135deg, #E8003D 0%, #B5002E 100%)",
                  boxShadow: "0 8px 24px rgba(232,0,61,0.50)",
                  padding: "14px 28px",
                  borderRadius: "14px",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Search Hotels
              </button>
            </div>
          </div>
        </motion.form>

        {/* ── Trust badges ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-0 mt-7"
          style={{
            background: "rgba(0,0,0,0.28)",
            borderRadius: "100px",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(16px)",
            padding: "10px 8px",
          }}
        >
          {trustBadges.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4"
              style={{
                borderRight: i < trustBadges.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
              }}
            >
              <span className="text-base leading-none">{b.icon}</span>
              <div className="text-left">
                <div className="text-xs font-extrabold text-white leading-none">{b.label}</div>
                <div className="text-[10px] leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 flex flex-col items-center gap-1"
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" className="w-5 h-5">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
