import { motion } from "framer-motion";

const STEPS = [
  {
    step: "01",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" aria-hidden="true">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.3"/>
        <path d="M16 24.5l2.5 2.5L24 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 13h22v4H13z" fill="currentColor" opacity="0.15" rx="2"/>
        <rect x="13" y="11" width="22" height="26" rx="3" stroke="currentColor" strokeWidth="2.5"/>
        <line x1="18" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <line x1="18" y1="25" x2="26" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <line x1="18" y1="30" x2="23" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    title: "Search & Filter",
    description:
      "Tell us your destination, dates and number of guests. Use smart filters to find the perfect room — from budget stays to luxury suites across 200+ Indian cities.",
    color: "#E8003D",
    bg: "rgba(232,0,61,0.08)",
    badge: "Takes 30 seconds",
  },
  {
    step: "02",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" aria-hidden="true">
        <rect x="10" y="14" width="28" height="22" rx="4" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M10 20h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <circle cx="17" cy="29" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="31" cy="29" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
        <path d="M17 8v6M31 8v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="35" cy="12" r="6" fill="#10B981"/>
        <path d="M32.5 12l1.5 1.5 2.5-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Check Availability",
    description:
      "Pick your check-in and check-out dates. Our real-time availability system shows you exactly which rooms are open — no surprises at checkout.",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    badge: "Real-time inventory",
  },
  {
    step: "03",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" aria-hidden="true">
        <rect x="8" y="10" width="32" height="28" rx="5" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M8 18h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <circle cx="16" cy="14" r="2" fill="currentColor" opacity="0.5"/>
        <circle cx="24" cy="14" r="2" fill="currentColor" opacity="0.5"/>
        <circle cx="32" cy="14" r="2" fill="currentColor" opacity="0.5"/>
        <circle cx="24" cy="30" r="7" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 30l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Book & Relax",
    description:
      "Confirm your booking with zero upfront payment. Pay at the hotel on arrival. Get instant confirmation on WhatsApp and email — then just show up and enjoy.",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    badge: "Pay at hotel",
  },
];

const connector = {
  hidden:  { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 1.2, ease: "easeInOut" } },
};

const HowItWorks = () => {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="section-px py-20 md:py-28"
      style={{ background: "var(--color-surface)" }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="text-center mb-16 md:mb-20"
      >
        <motion.span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
          whileInView={{ scale: [0.9, 1.05, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Simple Process
        </motion.span>
        <h2
          id="how-it-works-heading"
          className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Book your stay in{" "}
          <span style={{ color: "var(--color-primary)" }}>3 easy steps</span>
        </h2>
        <p
          className="text-base max-w-xl mx-auto leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          From search to check-in in minutes. No hidden fees, no complicated
          process — just seamless hotel booking built for India.
        </p>
      </motion.div>

      {/* ── Steps ──────────────────────────────────────────── */}
      <div className="relative max-w-5xl mx-auto">
        {/* Connecting line — desktop only */}
        <div
          className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px pointer-events-none"
          aria-hidden="true"
        >
          <motion.svg
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
            className="w-full h-4 overflow-visible"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.path
              d="M0 0.5 Q25 -3 50 0.5 Q75 4 100 0.5"
              stroke="var(--color-primary)"
              strokeWidth="0.8"
              strokeDasharray="3 3"
              fill="none"
              variants={connector}
            />
            {/* Arrow heads */}
            <path d="M33 -1.5L36 0.5L33 2.5" fill="none" stroke="var(--color-primary)" strokeWidth="0.8" strokeLinecap="round"/>
            <path d="M66 -1.5L69 0.5L66 2.5" fill="none" stroke="var(--color-primary)" strokeWidth="0.8" strokeLinecap="round"/>
          </motion.svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col"
            >
              {/* Card */}
              <motion.div
                className="flex flex-col flex-1 p-8 rounded-3xl"
                style={{
                  background: "var(--color-surface-2)",
                  boxShadow: "var(--shadow-md)",
                  border: "1px solid var(--color-border)",
                }}
                whileHover={{
                  scale: 1.02,
                  y: -8,
                  boxShadow: "var(--shadow-xl)",
                  transition: { duration: 0.28, ease: [0.34, 1.56, 0.64, 1] },
                }}
              >
                {/* Step number + icon row */}
                <div className="flex items-center justify-between mb-6">
                  <motion.span
                    className="font-display font-black text-5xl leading-none select-none"
                    style={{ color: s.color, opacity: 0.15 }}
                    whileHover={{ opacity: 0.25, scale: 1.05 }}
                    aria-hidden="true"
                  >
                    {s.step}
                  </motion.span>

                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: s.bg, color: s.color }}
                    whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
                  >
                    {s.icon}
                  </motion.div>
                </div>

                {/* Badge */}
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 self-start"
                  style={{ background: s.bg, color: s.color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: s.color }}
                    aria-hidden="true"
                  />
                  {s.badge}
                </span>

                {/* Title */}
                <h3
                  className="font-display font-bold text-xl mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {s.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {s.description}
                </p>

                {/* Bottom accent bar */}
                <div
                  className="mt-6 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${s.color} 0%, transparent 100%)`, opacity: 0.3 }}
                  aria-hidden="true"
                />
              </motion.div>

              {/* Mobile step connector */}
              {i < STEPS.length - 1 && (
                <div className="md:hidden flex justify-center my-4" aria-hidden="true">
                  <svg width="2" height="32" viewBox="0 0 2 32">
                    <line x1="1" y1="0" x2="1" y2="32" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA strip ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16"
      >
        <motion.a
          href="/rooms"
          className="btn-primary text-sm px-8 py-3.5 rounded-2xl"
          whileHover={{ scale: 1.05, boxShadow: "0 12px 32px rgba(232,0,61,0.45)" }}
          whileTap={{ scale: 0.97 }}
        >
          Start Booking Now →
        </motion.a>
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          No credit card required · Free cancellation
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
