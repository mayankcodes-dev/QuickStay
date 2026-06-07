import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import StarRating from "./StarRating";
import { optimiseImage } from "../utils/cloudinary";

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill={filled ? "var(--color-primary)" : "none"}
    stroke="var(--color-primary)" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const HotelCard = ({ room, index }) => {
  const { currency, navigate, wishlist, toggleWishlist } = useAppContext();
  const isBestSeller = index % 3 === 0;
  const imgSrc = optimiseImage(room.images?.[0], 600);
  const isWished = wishlist.includes(room._id.toString());

  // Use real average rating if available, fall back to 4.0 display
  const avgRating = room.avgRating ?? 4.0;
  const reviewCount = room.reviewCount ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] } }}
      className="rounded-2xl overflow-hidden cursor-pointer flex flex-col"
      style={{
        background: "var(--color-surface-2)",
        boxShadow: "var(--shadow-md)",
        transition: "box-shadow 0.25s ease",
      }}
      onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0); }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imgSrc}
          alt={`${room.hotel?.name} — ${room.roomType}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isBestSeller && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
              style={{ background: "var(--color-primary)" }}>
              🏆 Best Seller
            </span>
          )}
          {room.category && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold text-white backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.55)" }}>
              {room.category}
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
          style={{ background: isWished ? "rgba(232,0,61,0.15)" : "rgba(255,255,255,0.85)", border: isWished ? "1.5px solid var(--color-primary)" : "none" }}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(room._id); }}
          aria-label={isWished ? "Remove from wishlist" : "Save to wishlist"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={isWished ? "filled" : "empty"}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{   scale: 0.6,  opacity: 0 }}
              transition={{ duration: 0.18 }}>
              <HeartIcon filled={isWished} />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Hotel + Rating */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm leading-snug" style={{ color: "var(--color-text-primary)" }}>
              {room.hotel?.name}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-[11px] ml-1" style={{ color: "var(--color-text-muted)" }}>
                {avgRating.toFixed(1)}{reviewCount > 0 && ` (${reviewCount})`}
              </span>
            </div>
          </div>
          <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--color-text-secondary)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {room.hotel?.city}, India
          </p>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(room.amenities || []).slice(0, 3).map((a, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: "var(--color-surface-3)", color: "var(--color-text-secondary)" }}>
              {a}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <span className="font-black text-lg" style={{ color: "var(--color-primary)" }}>
              {currency}{room.pricePerNight?.toLocaleString("en-IN")}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>/night</span>
          </div>
          <button
            className="btn-primary text-xs py-2 px-4"
            onClick={(e) => { e.stopPropagation(); navigate(`/rooms/${room._id}`); window.scrollTo(0, 0); }}
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
