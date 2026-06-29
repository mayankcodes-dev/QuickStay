import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "../assets/assets";
import StarRating from "./StarRating";

// Group testimonials into pairs for desktop display
const chunk = (arr, size) => {
  const groups = [];
  for (let i = 0; i < arr.length; i += size) groups.push(arr.slice(i, i + size));
  return groups;
};

const TestimonialCard = ({ t }) => (
  <div
    className="flex flex-col justify-between rounded-2xl p-6 md:p-8 h-full"
    style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-md)" }}
  >
    {/* Quote mark */}
    <div>
      <div
        className="text-5xl font-serif leading-none mb-3"
        style={{ color: "var(--color-primary)", opacity: 0.22 }}
      >
        "
      </div>
      <p
        className="text-sm md:text-base leading-relaxed -mt-3"
        style={{ color: "var(--color-text-primary)" }}
      >
        {t.review}
      </p>
    </div>

    {/* Author row */}
    <div className="flex items-center gap-3 mt-5">
      <img
        src={t.image}
        alt={t.name}
        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
        style={{ outline: "2px solid var(--color-primary)", outlineOffset: "2px" }}
      />
      <div className="min-w-0">
        <div className="font-bold text-sm truncate" style={{ color: "var(--color-text-primary)" }}>
          {t.name}
        </div>
        <div className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
          {t.address}
        </div>
      </div>
      <div className="ml-auto flex-shrink-0">
        <StarRating rating={t.rating} />
      </div>
    </div>
  </div>
);

const Testimonial = () => {
  const groups   = chunk(testimonials, 2);   // pairs for desktop
  const total    = groups.length;
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % total);
    }, 5000);
  };

  const go = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    resetTimer();
  };

  const prev = () => go((current - 1 + total) % total);
  const next = () => go((current + 1) % total);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [total]);

  const variants = {
    enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.28 } }),
  };

  const pair = groups[current];

  return (
    <section className="py-16 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
          What Guests Say
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
          Loved by Travellers
        </h2>
      </motion.div>

      {/* Carousel */}
      <div className="relative max-w-4xl mx-auto">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {pair.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-7 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-md)" }}
          aria-label="Previous reviews"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"
            style={{ color: "var(--color-text-primary)" }}>
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-7 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-md)" }}
          aria-label="Next reviews"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"
            style={{ color: "var(--color-text-primary)" }}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Dots — one per pair */}
        <div className="flex justify-center gap-2 mt-6">
          {groups.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === current ? 24 : 8,
                height: 8,
                background: i === current ? "var(--color-primary)" : "var(--color-border-strong)",
              }}
              aria-label={`Reviews ${i * 2 + 1}–${i * 2 + 2}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
