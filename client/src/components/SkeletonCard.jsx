import { motion } from "framer-motion";

const SkeletonCard = ({ index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-3xl overflow-hidden"
    style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border)" }}
  >
    {/* Image placeholder */}
    <div className="skeleton h-60 w-full" style={{ borderRadius: 0 }} />

    {/* Content */}
    <div className="p-6 space-y-4">
      {/* Tags row */}
      <div className="flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>

      {/* Title */}
      <div className="skeleton h-5 w-4/5" />
      {/* Subtitle */}
      <div className="skeleton h-4 w-1/2" />

      {/* Amenities row */}
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-14 rounded-full" />
      </div>

      {/* Divider */}
      <div className="skeleton h-px w-full" style={{ borderRadius: 0 }} />

      {/* Price + button row */}
      <div className="flex items-center justify-between pt-1">
        <div className="skeleton h-7 w-24" />
        <div className="skeleton h-9 w-24 rounded-full" />
      </div>
    </div>
  </motion.div>
);

export default SkeletonCard;
