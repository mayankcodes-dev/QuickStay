import { motion } from "framer-motion";
import { featuredDestinations } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const FeaturedDestination = () => {
  const { navigate } = useAppContext();

  return (
    <section className="py-16 md:py-24 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
          Explore India
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
          Top Destinations
        </h2>
        <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
          From sun-soaked beaches to mountain retreats — pick your next adventure
        </p>
      </motion.div>

      {/* ── Uniform grid: 2 cols mobile → 3 cols tablet → 4 cols desktop ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
      >
        {featuredDestinations.map((dest) => (
          <motion.button
            key={dest.city}
            variants={cardVariants}
            onClick={() => navigate(`/rooms?destination=${dest.city}`)}
            className="relative rounded-2xl overflow-hidden group cursor-pointer focus:outline-none"
            style={{
              aspectRatio: "3 / 4",
              boxShadow: "var(--shadow-md)",
            }}
            whileHover={{ scale: 1.03, transition: { duration: 0.22, ease: [0.34, 1.56, 0.64, 1] } }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Image */}
            <img
              src={dest.image}
              alt={dest.city}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
              <h3 className="text-white font-bold text-base leading-tight">{dest.city}</h3>
              <p className="text-white/75 text-xs leading-snug mt-0.5">{dest.tagline}</p>
              <p className="text-white/55 text-[11px] mt-1">
                {dest.hotels.toLocaleString("en-IN")}+ hotels
              </p>
            </div>

            {/* Hover pill CTA */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                style={{ background: "var(--color-primary)" }}
              >
                Explore →
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedDestination;