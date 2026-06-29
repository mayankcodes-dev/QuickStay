import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { exclusiveOffers } from "../assets/assets";

// ── Animated flip digit ────────────────────────────────────────
const FlipDigit = ({ value }) => (
  <div className="relative overflow-hidden" style={{ perspective: "200px" }}>
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: -90, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="block bg-white/20 rounded px-1.5 py-0.5 font-bold text-sm text-white tabular-nums"
        style={{ transformOrigin: "center center" }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

// ── Countdown ──────────────────────────────────────────────────
const useCountdown = (targetDate) => {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { h: "00", m: "00", s: "00" };
    return {
      h: String(Math.floor(diff / 3600000) % 24).padStart(2, "0"),
      m: String(Math.floor(diff / 60000) % 60).padStart(2, "0"),
      s: String(Math.floor(diff / 1000) % 60).padStart(2, "0"),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
};

const CountdownDisplay = ({ targetDate }) => {
  const { h, m, s } = useCountdown(targetDate);
  return (
    <div className="flex items-center gap-0.5">
      <FlipDigit value={h[0]} /><FlipDigit value={h[1]} />
      <span className="text-white font-bold mx-0.5 opacity-70">:</span>
      <FlipDigit value={m[0]} /><FlipDigit value={m[1]} />
      <span className="text-white font-bold mx-0.5 opacity-70">:</span>
      <FlipDigit value={s[0]} /><FlipDigit value={s[1]} />
    </div>
  );
};

// ── Flash Deal Card ────────────────────────────────────────────
const FlashDealCard = ({ deal, index }) => {
  const { navigate } = useAppContext();
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] } }}
      whileTap={{ scale: 0.97 }}
      className="relative shrink-0 w-72 rounded-2xl overflow-hidden cursor-pointer group"
      style={{ boxShadow: "var(--shadow-lg)" }}
      onClick={() => navigate("/rooms")}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <motion.img
          src={deal.image}
          alt={deal.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Pulsing discount badge */}
        <motion.span
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black text-white"
          style={{ background: "var(--color-primary)" }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {deal.discount}% OFF
        </motion.span>
      </div>

      {/* Content */}
      <div className="p-4" style={{ background: "var(--color-surface-2)" }}>
        <h3 className="font-bold text-base mb-0.5" style={{ color: "var(--color-text-primary)" }}>
          {deal.title}
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-secondary)" }}>
          {deal.location}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs line-through" style={{ color: "var(--color-text-muted)" }}>
              ₹{deal.originalPrice.toLocaleString("en-IN")}
            </span>
            <span className="block font-black text-lg" style={{ color: "var(--color-primary)" }}>
              ₹{deal.discountedPrice.toLocaleString("en-IN")}
              <span className="text-xs font-medium text-[var(--color-text-muted)]">/night</span>
            </span>
          </div>
          <CountdownDisplay targetDate={deal.expiresAt} />
        </div>
      </div>
    </motion.div>
  );
};

// ── Flash Deals Section ────────────────────────────────────────
const FlashDeals = () => {
  const deals = [
    {
      id: 1,
      title: "OYO Townhouse Goa",
      location: "Calangute, Goa",
      originalPrice: 3200,
      discountedPrice: 1899,
      discount: 41,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
      expiresAt: new Date(Date.now() + 4 * 3600000 + 23 * 60000).toISOString(),
    },
    {
      id: 2,
      title: "Royal Rajput Heritage",
      location: "Jaipur, Rajasthan",
      originalPrice: 5500,
      discountedPrice: 3199,
      discount: 42,
      image: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=600&q=80",
      expiresAt: new Date(Date.now() + 8 * 3600000 + 47 * 60000).toISOString(),
    },
    {
      id: 3,
      title: "Business Stay Mumbai",
      location: "Andheri West, Mumbai",
      originalPrice: 4000,
      discountedPrice: 2499,
      discount: 37,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
      expiresAt: new Date(Date.now() + 2 * 3600000 + 11 * 60000).toISOString(),
    },
    {
      id: 4,
      title: "Lake View Udaipur",
      location: "Lake Pichola, Udaipur",
      originalPrice: 7200,
      discountedPrice: 4299,
      discount: 40,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      expiresAt: new Date(Date.now() + 12 * 3600000 + 5 * 60000).toISOString(),
    },
    {
      id: 5,
      title: "Himalayan Retreat",
      location: "Old Manali, Himachal Pradesh",
      originalPrice: 2800,
      discountedPrice: 1599,
      discount: 43,
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
      expiresAt: new Date(Date.now() + 6 * 3600000 + 33 * 60000).toISOString(),
    },
  ];

  return (
    <section className="py-12 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* Animated lightning bolt */}
            <motion.svg
              viewBox="0 0 24 24"
              fill="var(--color-primary)"
              className="w-5 h-5"
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </motion.svg>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>
              Flash Deals
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Today&apos;s Hot Offers
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Limited-time deals — ends when the clock hits zero
          </p>
        </div>
        <motion.button
          className="text-sm font-semibold hidden md:block"
          style={{ color: "var(--color-primary)" }}
          whileHover={{ x: 4 }}
          onClick={() => window.location.href = "/rooms"}
        >
          View all →
        </motion.button>
      </motion.div>

      {/* Horizontal scroll cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
        {deals.map((deal, i) => (
          <div key={deal.id} className="snap-start">
            <FlashDealCard deal={deal} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashDeals;
