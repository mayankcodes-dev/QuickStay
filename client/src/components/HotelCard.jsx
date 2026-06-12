import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.28, ease: [0.34, 1.56, 0.64, 1] } }}
      className="rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: "var(--color-surface-2)",
        boxShadow: "var(--shadow-md)",
        transition: "box-shadow 0.3s ease",
        border: "1px solid var(--color-border)",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-xl)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
    >
      {/* Image — wrapped in Link for full keyboard + screen-reader support */}
      <Link
        to={hotelPath}
        onClick={() => window.scrollTo(0, 0)}
        className="relative block h-60 overflow-hidden"
        aria-label={`View ${room.hotel?.name}`}
        tabIndex={0}
      >
        <img
          src={imgSrc}
          alt={`${room.hotel?.name} — ${room.roomType}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          width={600}
          height={400}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5" aria-hidden="true">
          {isBestSeller && (
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
              style={{ background: "var(--color-primary)" }}
            >
              🏆 Best Seller
            </span>
          )}
          {room.category && (
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.55)" }}
            >
              {room.category}
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-200 hover:scale-110"
          style={{ background: "rgba(255,255,255,0.90)" }}
          onClick={(e) => e.preventDefault()}   /* prevent nav on card-click */
          aria-label="Save to wishlist"
          tabIndex={0}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 shrink-0" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {room.hotel?.city}, India
          </p>
        </div>

        {/* Amenities */}

        <div className="flex flex-wrap gap-2" aria-label="Amenities">
          {(room.amenities || []).slice(0, 3).map((a, i) => (
            <span
              key={i}
              className="text-[11px] px-2.5 py-1 rounded-full"
              style={{
                background: "var(--color-surface-3)",
                color: "var(--color-text-secondary)",
              }}
            >
              {AMENITY_ICONS[a] ? `${AMENITY_ICONS[a]} ` : ""}{a}
            </span>
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

          <Link
            to={hotelPath}
            onClick={() => window.scrollTo(0, 0)}
            className="btn-primary text-xs py-2.5 px-5"
          >
            Book Now
          </Link>
        </div>

      </div>
    </motion.article>
  );
};

export default HotelCard;
