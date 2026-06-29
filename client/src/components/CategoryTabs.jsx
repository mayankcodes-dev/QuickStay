import { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

const categories = [
  {
    id: "all",
    label: "All Stays",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "Budget",
    label: "Budget",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: "Premium",
    label: "Premium",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "Luxury",
    label: "Luxury",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "Villa",
    label: "Villas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M3 7l9-5 9 5" />
        <line x1="12" y1="2" x2="12" y2="7" />
      </svg>
    ),
  },
  {
    id: "Business",
    label: "Business",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const tabVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const CategoryTabs = ({ onSelect }) => {
  const [active, setActive] = useState("all");
  const { darkMode } = useAppContext();

  const handleSelect = (id) => {
    setActive(id);
    if (onSelect) onSelect(id);
  };

  return (
    <section className="py-6 overflow-x-auto scrollbar-hide" style={{ background: "var(--color-surface)" }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 px-4 md:px-16 lg:px-24 xl:px-32 min-w-max md:min-w-0 md:justify-center"
      >
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <motion.button
              key={cat.id}
              variants={tabVariants}
              onClick={() => handleSelect(cat.id)}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.93 }}
              className="relative flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl cursor-pointer group shrink-0"
              style={{
                background: isActive ? "var(--color-primary-light)" : "transparent",
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {/* Icon with hover rotation */}
              <motion.span
                whileHover={{ rotate: isActive ? 0 : 12 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="block"
              >
                {cat.icon}
              </motion.span>

              {/* Label */}
              <span className="text-xs font-semibold whitespace-nowrap">{cat.label}</span>

              {/* Active indicator — layout animated pill */}
              {isActive && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                  style={{ background: "var(--color-primary)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              {/* Active background — layout animated */}
              {isActive && (
                <motion.div
                  layoutId="category-bg"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{ background: "var(--color-primary-light)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
};

export default CategoryTabs;
