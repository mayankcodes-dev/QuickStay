import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

// ─── Avatar dropdown ──────────────────────────────────────────
const AvatarMenu = ({ user, logout, navigate, isOwner, setShowHotelReg }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const initial = user?.username?.[0]?.toUpperCase() || "?";

  const menuItems = [
    {
      label: "My Bookings",
      onClick: () => { navigate("/my-bookings"); setOpen(false); },
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 opacity-60">
          <rect x="3" y="4" width="14" height="14" rx="2"/><path d="M7 2v4M13 2v4M3 10h14"/>
        </svg>
      ),
    },
    {
      label: isOwner ? "Owner Dashboard" : "List My Property",
      onClick: () => { setOpen(false); isOwner ? navigate("/owner") : setShowHotelReg(true); },
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 opacity-60">
          <path d="M10 2l8 7H2l8-7zM4 9v8h12V9"/><rect x="7" y="13" width="6" height="4"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label="Open account menu"
        aria-expanded={open}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs text-white overflow-hidden ring-2 ring-transparent hover:ring-white/20 transition-all"
        style={{ background: "linear-gradient(135deg,#E8003D,#9B001F)" }}
      >
        {user.image
          ? <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
          : initial}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Account menu"
            initial={{ opacity: 0, y: -10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.92 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-11 w-56 rounded-2xl overflow-hidden shadow-2xl z-50"
            style={{
              background: "rgba(12,12,20,0.98)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* User info */}
            <div className="px-4 py-3.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden"
                  style={{ background: "linear-gradient(135deg,#E8003D,#9B001F)" }}
                >
                  {user.image
                    ? <img src={user.image} alt={user.username} className="w-8 h-8 object-cover" />
                    : initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                  <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.38)" }}>{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu items with stagger */}
            <div className="py-2">
              {menuItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  role="menuitem"
                  onClick={item.onClick}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.08, duration: 0.18 }}
                  whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.06)" }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2.5"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              ))}

              <div className="mx-3 my-1.5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

              <motion.button
                role="menuitem"
                onClick={() => { logout(); setOpen(false); }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, duration: 0.18 }}
                whileHover={{ x: 4, backgroundColor: "rgba(248,113,113,0.08)" }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2.5"
                style={{ color: "#F87171" }}
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 opacity-70">
                  <path d="M13 3h4v14h-4M8 14l-4-4 4-4M4 10h9"/>
                </svg>
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Nav link ─────────────────────────────────────────────────
const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    aria-current={active ? "page" : undefined}
    className="relative px-3.5 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200"
    style={{ color: active ? "#ffffff" : "rgba(255,255,255,0.52)" }}
  >
    {active && (
      <motion.span
        layoutId="nav-active"
        className="absolute inset-0 rounded-full -z-10"
        style={{ background: "rgba(255,255,255,0.12)" }}
        transition={{ type: "spring", stiffness: 500, damping: 38 }}
      />
    )}
    {children}
  </Link>
);

// ─── Mobile bottom nav ────────────────────────────────────────
const mobileLinks = [
  {
    name: "Home", path: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    name: "Hotels", path: "/rooms",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
  {
    name: "Bookings", path: "/my-bookings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      </svg>
    ),
  },
];

// ─── Dark/Light toggle with animated icon swap ─────────────────
const DarkToggle = ({ darkMode, toggleDarkMode }) => (
  <motion.button
    onClick={toggleDarkMode}
    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    whileHover={{ scale: 1.12, rotate: 15 }}
    whileTap={{ scale: 0.88 }}
    className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
    style={{
      color: darkMode ? "#FBBF24" : "rgba(255,255,255,0.55)",
      background: "rgba(255,255,255,0.06)",
    }}
  >
    <AnimatePresence mode="wait" initial={false}>
      {darkMode ? (
        <motion.svg
          key="sun"
          width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </motion.svg>
      ) : (
        <motion.svg
          key="moon"
          width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
          initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </motion.svg>
      )}
    </AnimatePresence>
  </motion.button>
);

// ─── MAIN NAVBAR ──────────────────────────────────────────────
const Navbar = () => {
  const location = useLocation();
  const { user, darkMode, toggleDarkMode, logout, navigate, isOwner, setShowHotelReg } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const isActive = p => p === "/" ? location.pathname === "/" : location.pathname.startsWith(p);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { name: "Home",        path: "/" },
    { name: "Hotels",      path: "/rooms" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  return (
    <>
      {/* ── Desktop floating navbar ───────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{ paddingTop: "14px" }}
      >
        <motion.nav
          aria-label="Main navigation"
          initial={{ opacity: 0, y: -28, scaleX: 0.85 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-1 px-3"
          style={{
            height: "52px",
            borderRadius: "100px",
            maxWidth: "820px",
            width: "calc(100% - 40px)",
            background: scrolled
              ? "rgba(10, 10, 18, 0.95)"
              : "rgba(10, 10, 18, 0.72)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: scrolled
              ? "0 16px 48px rgba(0,0,0,0.60), 0 0 0 0.5px rgba(255,255,255,0.05) inset, 0 1px 0 rgba(255,255,255,0.06) inset"
              : "0 4px 24px rgba(0,0,0,0.30)",
            transition: "background 0.35s, box-shadow 0.35s",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 mr-2" aria-label="YoYo home">
            <Logo size="md" />
          </Link>

          {/* Nav links — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-0.5 flex-1">
            {links.map(l => (
              <NavLink key={l.path} to={l.path} active={isActive(l.path)}>
                {l.name}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 ml-auto">
            <DarkToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            {/* Divider */}
            <div
              className="w-px h-5 hidden sm:block"
              style={{ background: "rgba(255,255,255,0.12)" }}
            />

            {user ? (
              <AvatarMenu
                user={user}
                logout={logout}
                navigate={navigate}
                isOwner={isOwner}
                setShowHotelReg={setShowHotelReg}
              />
            ) : (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/login"
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg,#E8003D 0%,#B5002E 100%)",
                    boxShadow: "0 4px 16px rgba(232,0,61,0.40)",
                    letterSpacing: "0.01em",
                  }}
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM2 18c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  Sign In
                </Link>
              </motion.div>
            )}
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile bottom nav ────────────────────────────────── */}
      <nav
        aria-label="Mobile navigation"
        className="sm:hidden fixed bottom-4 left-4 right-4 z-50"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-around py-3 px-6 rounded-2xl"
          style={{
            background: "rgba(10,10,18,0.96)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.50)",
          }}
        >
          {mobileLinks.map(l => {
            const active = isActive(l.path);
            return (
              <Link
                key={l.path}
                to={l.path}
                aria-current={active ? "page" : undefined}
                aria-label={l.name}
                className="flex flex-col items-center gap-1 min-w-[44px]"
                style={{ color: active ? "#E8003D" : "rgba(255,255,255,0.45)" }}
              >
                <motion.span
                  whileTap={{ scale: 0.80 }}
                  animate={active ? { scale: [1, 1.22, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="block"
                >
                  {l.icon}
                </motion.span>
                <motion.span
                  className="text-[10px] font-semibold"
                  animate={active ? { scale: 1 } : { scale: 1 }}
                >
                  {l.name}
                </motion.span>
                {active && (
                  <motion.div
                    layoutId="mobile-active-dot"
                    className="w-1 h-1 rounded-full"
                    style={{ background: "#E8003D" }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </motion.div>
      </nav>
    </>
  );
};

export default Navbar;