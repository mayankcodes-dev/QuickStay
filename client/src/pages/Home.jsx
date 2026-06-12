import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/NewsLetter";
import HotelCard from "../components/HotelCard";
import CategoryTabs from "../components/CategoryTabs";
import FlashDeals from "../components/FlashDeals";
import AppBanner from "../components/AppBanner";
import SkeletonCard from "../components/SkeletonCard";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

const STATS = [
  { icon: "🏨", value: "10,000+", label: "Hotels Across India" },
  { icon: "😊", value: "1M+",    label: "Happy Guests" },
  { icon: "🏙️", value: "200+",   label: "Cities Covered" },
  { icon: "💰", value: "₹500",   label: "Starting per Night" },
];

const Home = () => {
  const { rooms } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("all");

  // Rooms are loading when the array is still empty on first mount.
  // Once fetchRooms resolves, the array will have items (or stay [] if the
  // DB is genuinely empty — you can differentiate with a `loading` flag if needed).
  const isLoading = rooms.length === 0;

  const filteredRooms = useMemo(() => {
    if (activeCategory === "all") return rooms.slice(0, 8);
    return rooms.filter((r) => r.category === activeCategory).slice(0, 8);
  }, [rooms, activeCategory]);

  return (
    <>
      {/* Full-screen video hero */}
      <Hero />

      {/* Category tabs */}
      <CategoryTabs onSelect={setActiveCategory} />

      {/* ── Recommended Hotels Grid ────────────────────────────── */}
      <main id="main-content">
        <section
          aria-labelledby="hotels-heading"
          className="section-px py-20 md:py-32"
        >
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-14"
          >
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--color-primary)" }}
              >
                Handpicked for You
              </p>
              <h2
                id="hotels-heading"
                className="font-display text-3xl md:text-4xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {activeCategory === "all"
                  ? "Recommended Hotels"
                  : `${activeCategory} Hotels`}
              </h2>
              <p
                className="text-sm mt-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Top-rated stays selected just for your preferences
              </p>
            </div>

            <Link
              to="/rooms"
              className="text-sm font-semibold hidden md:flex items-center gap-1.5 transition-opacity hover:opacity-75"
              style={{ color: "var(--color-primary)" }}
            >
              View all
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-8 rounded-3xl"
                style={{
                  background: "var(--color-surface-2)",
                  boxShadow: "var(--shadow-md)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div
                  className="font-display font-black text-xl"
                  style={{ color: "var(--color-primary)" }}
                >
                  {s.value}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Hotel grid or skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map((room, i) => (
                <HotelCard key={room._id} room={room} index={i} />
              ))
            ) : (
              <p
                className="col-span-4 text-center py-20"
                style={{ color: "var(--color-text-muted)" }}
              >
                No {activeCategory} hotels found. Try a different category.
              </p>
            )}
          </div>

          {/* Mobile — view all CTA */}
          <div className="text-center mt-14 md:hidden">
            <Link to="/rooms" className="btn-outline text-sm">
              View All Hotels →
            </Link>
          </div>
        </section>

        {/* Flash Deals with countdown */}
        <FlashDeals />

        {/* Featured Indian Destinations */}
        <FeaturedDestination />

        {/* Exclusive Offers */}
        <ExclusiveOffers />

        {/* App Download Banner */}
        <AppBanner />

        {/* Testimonials */}
        <Testimonial />

        {/* Newsletter */}
        <Newsletter />
      </main>
    </>
  );
};

export default Home;
