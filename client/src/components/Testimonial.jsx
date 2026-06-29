import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { testimonials } from "../assets/assets";
import StarRating from "./StarRating";

const TOTAL = testimonials.length;

// Static card — no animation (used after initial reveal)
const CardContent = ({ t }) => (
  <motion.div
    className="flex flex-col justify-between rounded-2xl p-6 h-full cursor-default"
    style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-md)" }}
    whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }}
    transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
  >
    <div>
      <div className="text-5xl font-serif leading-none mb-2"
        style={{ color: "var(--color-primary)", opacity: 0.22 }}>
        "
      </div>
      <p className="text-sm leading-relaxed -mt-3" style={{ color: "var(--color-text-primary)" }}>
        {t.review}
      </p>
    </div>
    <div className="flex items-center gap-3 mt-5">
      <img src={t.image} alt={t.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        style={{ outline: "2px solid var(--color-primary)", outlineOffset: "2px" }} />
      <div className="min-w-0">
        <div className="font-bold text-xs truncate" style={{ color: "var(--color-text-primary)" }}>{t.name}</div>
        <div className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>{t.address}</div>
      </div>
      <div className="ml-auto flex-shrink-0">
        <StarRating rating={t.rating} />
      </div>
    </div>
  </motion.div>
);

const Testimonial = () => {
  const [startIdx,  setStartIdx]  = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef    = useRef(null);
  const sectionRef  = useRef(null);

  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => advance(1), 35000);
  };

  const advance = (dir) => {
    setDirection(dir);
    setStartIdx(prev => (prev + dir + TOTAL) % TOTAL);
  };

  const next = () => { advance(1);  resetTimer(); };
  const prev = () => { advance(-1); resetTimer(); };

  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, []);

  // Build 3 visible cards from the window
  const visible = [0, 1, 2].map(i => testimonials[(startIdx + i) % TOTAL]);

  return (
    <section className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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

      <div ref={sectionRef} className="relative max-w-6xl mx-auto">

        {/* 3-column flex layout — AnimatePresence popLayout gives us the slide shift effect */}
        <div className="flex flex-col md:flex-row gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((t) => (
              <motion.div
                layout
                key={t.id}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 80 : -80, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: direction > 0 ? -80 : 80, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full md:w-[calc(33.333%-0.67rem)] flex-shrink-0 min-h-[220px]"
              >
                <CardContent t={t} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Arrows */}
        <button onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-7 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
          style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-md)" }}
          aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" style={{ color: "var(--color-text-primary)" }}>
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-7 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
          style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-md)" }}
          aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" style={{ color: "var(--color-text-primary)" }}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button key={i}
              onClick={() => {
                const dir = i > startIdx ? 1 : -1;
                setDirection(dir); setStartIdx(i);
                resetTimer();
              }}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === startIdx ? 20 : 7,
                height: 7,
                background: i === startIdx ? "var(--color-primary)" : "var(--color-border-strong)",
              }}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
