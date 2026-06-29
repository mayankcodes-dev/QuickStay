import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "./Logo";

const columns = [
  {
    heading: "Company",
    items: [
      { label: "About YoYo",   href: "/" },
      { label: "Careers",      href: "/" },
      { label: "Press",        href: "/" },
      { label: "Blog",         href: "/" },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Help Center",         href: "/" },
      { label: "Contact Us",          href: "/" },
      { label: "Cancellation Policy", href: "/" },
      { label: "Safety Info",         href: "/" },
    ],
  },
  {
    heading: "Partner With Us",
    items: [
      { label: "List Your Property",  href: "/" },
      { label: "Hotel Owner Login",   href: "/owner" },
      { label: "Affiliate Program",   href: "/" },
      { label: "Investor Relations",  href: "/" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy Policy",   href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy",    href: "/" },
    ],
  },
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/coderMayank69",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      className="mt-auto"
      style={{ background: "#040408", color: "#9898B8" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Top animated shimmer bar ──────────────────── */}
      <div
        className="h-0.5 w-full shimmer-bar"
      />

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 pt-14 pb-8">

        {/* ── Main grid ──────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12"
        >

          {/* Brand column */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Logo size="lg" />

            <p className="text-sm text-white/50 leading-relaxed max-w-xs mt-5 mb-6">
              India's fastest-growing hotel booking platform. Budget to luxury —
              10,000+ verified hotels across India.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.65)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  whileHover={{
                    y: -5,
                    scale: 1.15,
                    backgroundColor: "rgba(232,0,61,0.85)",
                    color: "#ffffff",
                    boxShadow: "0 8px 20px rgba(232,0,61,0.35)",
                  }}
                  whileTap={{ scale: 0.90 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav link columns */}
          {columns.map((col) => (
            <motion.div key={col.heading} variants={itemVariants}>
              <h4
                className="font-bold text-sm mb-4 tracking-wide"
                style={{ color: "#FFFFFF" }}
              >
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                      <Link
                        to={item.href}
                        className="text-sm transition-colors duration-200 hover:text-white"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Divider ────────────────────────────────── */}
        <div
          className="w-full h-px mb-6"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />

        {/* ── Bottom bar ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>
            © {year} YoYo Technologies Pvt. Ltd. All rights reserved.
          </p>

          {/* Made with love by Mayank */}
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
            <span>Made with</span>
            <motion.svg
              viewBox="0 0 24 24"
              fill="#E8003D"
              className="w-3.5 h-3.5"
              style={{ filter: "drop-shadow(0 0 4px rgba(232,0,61,0.6))" }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </motion.svg>
            <span>in India by</span>
            <a
              href="https://codermayank69.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold transition-colors duration-200 hover:text-white relative group"
              style={{ color: "#E8003D" }}
            >
              Mayank
              <span
                className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ background: "#E8003D" }}
              />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
