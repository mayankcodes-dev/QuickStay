import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
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
import JsonLd from "../components/JsonLd";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

const Home = () => {
  const { rooms } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredRooms = useMemo(() => {
    if (activeCategory === "all") return rooms.slice(0, 8);
    return rooms.filter((r) => r.category === activeCategory).slice(0, 8);
  }, [rooms, activeCategory]);

  const isLoading = rooms.length === 0;

  return (
    <>
      <Helmet>
        <title>YoYo Rooms — Book Hotels Across India | Best Price Guarantee</title>
        <meta name="description" content="Book budget to luxury hotels across India on YoYo Rooms. Instant confirmation, free cancellation, best price guarantee. 10,000+ verified hotels in 200+ cities." />
        <meta property="og:title" content="YoYo Rooms — India's Fastest Growing Hotel Platform" />
        <meta property="og:description" content="Find and book the perfect stay across India. Budget to luxury, instant confirmation." />
        <meta property="og:type" content="website" />
      </Helmet>
      <JsonLd type="WebSite" />

      {/* Full-screen video hero */}
      <Hero />

      {/* Category tabs */}
      <CategoryTabs onSelect={setActiveCategory} />

      {/* Recommended Hotels Grid */}
      <section className="py-10 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
              Handpicked for You
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              {activeCategory === "all" ? "Recommended Hotels" : `${activeCategory} Hotels`}
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Top-rated stays selected just for your preferences
            </p>
          </div>
          <a href="/rooms" className="text-sm font-semibold hidden md:flex items-center gap-1"
            style={{ color: "var(--color-primary)" }}>
            View all
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </motion.div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: "🏨", value: "10,000+", label: "Hotels Across India" },
            { icon: "😊", value: "1M+", label: "Happy Guests" },
            { icon: "🏙️", value: "200+", label: "Cities Covered" },
            { icon: "💰", value: "₹500", label: "Starting per Night" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center p-5 rounded-2xl"
              style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="font-display font-black text-xl" style={{ color: "var(--color-primary)" }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Hotel grid or skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredRooms.length > 0
              ? filteredRooms.map((room, i) => <HotelCard key={room._id} room={room} index={i} />)
              : <p className="col-span-4 text-center py-16" style={{ color: "var(--color-text-muted)" }}>
                  No {activeCategory} hotels found. Try a different category.
                </p>
          }
        </div>

        {/* Mobile view all */}
        <div className="text-center mt-8 md:hidden">
          <a href="/rooms" className="btn-outline text-sm inline-block">View All Hotels →</a>
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
    </>
  );
};

export default Home;
