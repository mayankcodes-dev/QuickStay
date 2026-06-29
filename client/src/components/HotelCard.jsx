import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import StarRating from "./StarRating";
import { optimiseImage } from "../utils/cloudinary";

// Amenity → emoji lookup with a sensible default
const AMENITY_ICONS = {
  "Free Wi-Fi":      "📶",
  "Free Breakfast":  "🍳",
  "Room Service":    "🛎️",
  "Pool Access":     "🏊",
  "Mountain View":   "🏔️",
  "Air Conditioning":"❄️",
  "Parking":         "🅿️",
  "Gym":             "🏋️",
  "Spa":             "💆",
};

const HotelCard = ({ room, index }) => {
  const { currency } = useAppContext();
  const isBestSeller = index % 3 === 0;
  const imgSrc = optimiseImage(room.images?.[0], 600);
  const hotelPath = `/rooms/${room._id}`;
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.30, ease: [0.34, 1.56, 0.64, 1] } }}
      className="rounded-3xl overflow-hidden flex flex-col will-change-transform"
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Image */}
      <Link
        to={hotelPath}
        onClick={() => window.scrollTo(0, 0)}
        className="relative block h-60 overflow-hidden"
        aria-label={`View ${room.hotel?.name}`}
        tabIndex={0}
      >
        <motion.img
          src={imgSrc}
          alt={`${room.hotel?.name} — ${room.roomType}`}
          className="w-full h-full object-cover"
          loading="lazy"
          width={600}
          height={400}
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Gradient overlay on image */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)" }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5" aria-hidden="true">
          {isBestSeller && (
            <motion.span
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index % 4) * 0.09 + 0.25, duration: 0.4 }}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
              style={{ background: "var(--color-primary)", boxShadow: "0 2px 8px rgba(232,0,61,0.45)" }}
            >
              🏆 Best Seller
            </motion.span>
          )}
          {room.category && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index % 4) * 0.09 + 0.32, duration: 0.4 }}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.55)" }}
            >
              {room.category}
            </motion.span>
          )}
        </div>

        {/* Wishlist heart */}
        <motion.button
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.92)" }}
          onClick={(e) => { e.preventDefault(); setWishlisted(w => !w); }}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          whileHover={{ scale: 1.14 }}
          whileTap={{ scale: 0.86 }}
          tabIndex={0}
        >
          <AnimatePresence mode="wait">
            {wishlisted ? (
              <motion.svg
                key="filled"
                viewBox="0 0 24 24"
                fill="#E8003D"
                className="w-4 h-4"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </motion.svg>
            ) : (
              <motion.svg
                key="outline"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                className="w-4 h-4"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-4">

        {/* Room type tag */}
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
          >
            {room.roomType}
          </span>
          {room.category && (
            <span
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)" }}
            >
              {room.category}
            </span>
          )}
        </div>

        {/* Hotel + Location */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="font-bold text-base leading-snug"
              style={{ color: "var(--color-text-primary)" }}
            >
              {room.hotel?.name}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0">
              <StarRating rating={4} />
              <span className="text-[11px] ml-1" style={{ color: "var(--color-text-muted)" }}>
                4.5
              </span>
            </div>
          </div>

          <p
            className="text-xs flex items-center gap-1.5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {room.hotel?.city}, India
          </p>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2" aria-label="Amenities">
          {(room.amenities || []).slice(0, 3).map((a, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 + 0.1 }}
              className="text-[11px] px-2.5 py-1 rounded-full"
              style={{ background: "var(--color-surface-3)", color: "var(--color-text-secondary)" }}
            >
              {AMENITY_ICONS[a] ? `${AMENITY_ICONS[a]} ` : ""}{a}
            </motion.span>
          ))}
        </div>

        {/* Price + CTA */}
        <div
          className="flex items-center justify-between mt-auto pt-5 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <span
              className="font-black text-xl"
              style={{ color: "var(--color-primary)" }}
            >
              {currency}{room.pricePerNight?.toLocaleString("en-IN")}
            </span>
            <span className="text-xs ml-1" style={{ color: "var(--color-text-muted)" }}>
              / night
            </span>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Link
              to={hotelPath}
              onClick={() => window.scrollTo(0, 0)}
              className="btn-primary text-xs py-2.5 px-5"
            >
              Book Now
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default HotelCard;
