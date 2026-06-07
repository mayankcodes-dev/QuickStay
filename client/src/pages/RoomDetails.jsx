import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { assets, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import ImageLightbox from "../components/ImageLightbox";
import ReviewSection, { AMENITY_ICONS } from "../components/ReviewSection";
import HotelCard from "../components/HotelCard";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

// Fix Leaflet default icon in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Price breakdown component ──────────────────────────────
const PriceBreakdown = ({ baseAmount, nights, currency }) => {
  const gst     = Math.round(baseAmount * 0.12);
  const svcFee  = 99;
  const total   = baseAmount + gst + svcFee;
  return (
    <div className="rounded-xl p-4 mt-4" style={{ background: "var(--color-surface-3)" }}>
      <p className="font-semibold text-sm mb-3" style={{ color: "var(--color-text-primary)" }}>Price Breakdown</p>
      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between">
          <span style={{ color: "var(--color-text-secondary)" }}>Room × {nights} night{nights > 1 ? "s" : ""}</span>
          <span style={{ color: "var(--color-text-primary)" }}>{currency}{baseAmount.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--color-text-secondary)" }}>GST (12%)</span>
          <span style={{ color: "var(--color-text-primary)" }}>{currency}{gst.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--color-text-secondary)" }}>Service fee</span>
          <span style={{ color: "var(--color-text-primary)" }}>{currency}{svcFee}</span>
        </div>
        <div className="flex justify-between border-t pt-2 mt-1 font-bold" style={{ borderColor: "var(--color-border)" }}>
          <span style={{ color: "var(--color-text-primary)" }}>Total</span>
          <span style={{ color: "var(--color-primary)" }}>{currency}{total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
};

// ── Coupon input ───────────────────────────────────────────
const CouponInput = ({ onApply }) => {
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);
  const { axios } = useAppContext();

  const apply = async () => {
    if (!code.trim()) return;
    setApplying(true);
    try {
      const { data } = await axios.post("/api/bookings/validate-coupon", { couponCode: code });
      if (data.success) { toast.success(`🎟️ ${data.message}`); onApply(data); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.message); }
    finally { setApplying(false); }
  };

  return (
    <div className="flex gap-2 mt-3">
      <input
        value={code}
        onChange={e => setCode(e.target.value.toUpperCase())}
        placeholder="Coupon code"
        maxLength={20}
        className="flex-1 rounded-xl px-3 py-2 text-sm border outline-none"
        style={{
          background: "var(--color-surface-3)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-primary)",
        }}
        onKeyDown={e => e.key === "Enter" && apply()}
      />
      <button onClick={apply} disabled={applying || !code.trim()}
        className="btn-primary text-xs px-4 py-2 disabled:opacity-50">
        {applying ? "…" : "Apply"}
      </button>
    </div>
  );
};

// ── Payment method tabs ────────────────────────────────────
const PaymentTabs = ({ value, onChange }) => {
  const opts = [
    { id: "pay at hotel", label: "Pay at Hotel" },
    { id: "stripe",       label: "💳 Card"       },
    { id: "razorpay",     label: "🔵 Razorpay"   },
  ];
  return (
    <div className="grid grid-cols-3 gap-1.5 rounded-xl p-1.5" style={{ background: "var(--color-surface-3)" }}>
      {opts.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className="py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: value === o.id ? "var(--color-primary)" : "transparent",
            color: value === o.id ? "#fff" : "var(--color-text-secondary)",
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────
const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, getToken, axios, navigate, currency, wishlist, toggleWishlist } = useAppContext();

  const [room,          setRoom]          = useState(null);
  const [mainImg,       setMainImg]       = useState(0);
  const [lightboxOpen,  setLightboxOpen]  = useState(false);
  const [checkInDate,   setCheckInDate]   = useState("");
  const [checkOutDate,  setCheckOutDate]  = useState("");
  const [guests,        setGuests]        = useState(1);
  const [isAvailable,   setIsAvailable]   = useState(false);
  const [payMethod,     setPayMethod]     = useState("pay at hotel");
  const [coupon,        setCoupon]        = useState(null);
  const [booking,       setBooking]       = useState(false);
  const [mapCoords,     setMapCoords]     = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const nights = checkInDate && checkOutDate
    ? Math.max(0, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / 86400000))
    : 0;

  const baseTotal = room ? room.pricePerNight * nights : 0;
  const isWished  = wishlist.includes(id);

  // Find room from context
  useEffect(() => {
    const found = rooms.find(r => r._id === id);
    if (found) {
      setRoom(found);
      setMainImg(0);
    }
  }, [rooms, id]);

  // Geocode hotel city for Leaflet map
  useEffect(() => {
    if (!room?.hotel?.city) return;
    const city = encodeURIComponent(`${room.hotel.city}, India`);
    fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`)
      .then(r => r.json())
      .then(d => { if (d[0]) setMapCoords([parseFloat(d[0].lat), parseFloat(d[0].lon)]); })
      .catch(() => {});
  }, [room?.hotel?.city]);

  const checkAvailability = useCallback(async () => {
    if (checkInDate >= checkOutDate) { toast.error("Check-out must be after check-in"); return; }
    try {
      const { data } = await axios.post("/api/bookings/check-availability", { room: id, checkInDate, checkOutDate });
      if (data.success) {
        setIsAvailable(data.isAvailable);
        data.isAvailable ? toast.success("✅ Room is available!") : toast.error("Room not available for these dates");
      } else toast.error(data.message);
    } catch (err) { toast.error(err.message); }
  }, [id, checkInDate, checkOutDate, axios]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAvailable) return checkAvailability();
    setBooking(true);
    try {
      const payload = {
        room: id, checkInDate, checkOutDate, guests,
        paymentMethod: payMethod,
        couponCode: coupon?.code,
      };
      const { data } = await axios.post("/api/bookings/book", payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (!data.success) { toast.error(data.message); return; }

      // Stripe redirect
      if (payMethod === "stripe") {
        const stripeRes = await axios.post("/api/bookings/stripe-payment", { bookingId: data.bookingId }, {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if (stripeRes.data.success) { localStorage.setItem("pendingBookingId", data.bookingId); window.location.href = stripeRes.data.url; return; }
      }
      // Razorpay
      if (payMethod === "razorpay") {
        const rzpRes = await axios.post("/api/bookings/razorpay-order", { bookingId: data.bookingId }, {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if (rzpRes.data.success) {
          const rzp = new window.Razorpay({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            order_id: rzpRes.data.orderId,
            amount: rzpRes.data.amount,
            currency: "INR",
            name: "YoYo Rooms",
            description: `Booking ${data.bookingId}`,
            theme: { color: "#E8003D" },
            handler: async (response) => {
              const verRes = await axios.post("/api/bookings/verify-razorpay", { ...response, bookingId: data.bookingId }, {
                headers: { Authorization: `Bearer ${await getToken()}` },
              });
              if (verRes.data.success) { toast.success("🎉 Payment successful!"); navigate(`/booking-confirmation/${data.bookingId}`); }
              else toast.error("Payment verification failed");
            },
          });
          rzp.open();
          return;
        }
      }

      toast.success("🎉 Booking confirmed!");
      navigate(`/booking-confirmation/${data.bookingId}`);
    } catch (err) { toast.error(err.message); }
    finally { setBooking(false); }
  };

  // Similar rooms (same city, exclude current)
  const similarRooms = rooms.filter(r => r._id !== id && r.hotel?.city === room?.hotel?.city).slice(0, 3);

  if (!room) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-surface)" }}>
      <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "var(--color-primary) transparent transparent transparent" }} />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-16 lg:px-24 xl:px-32" style={{ background: "var(--color-surface)" }}>
      <Helmet>
        <title>{room.hotel.name} — {room.roomType} | YoYo Rooms</title>
        <meta name="description" content={`Book ${room.roomType} at ${room.hotel.name}, ${room.hotel.city}. Starting at ${currency}${room.pricePerNight}/night. Free cancellation available.`} />
      </Helmet>

      {/* Image lightbox */}
      <ImageLightbox images={room.images} open={lightboxOpen} startIndex={mainImg} onClose={() => setLightboxOpen(false)} />

      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-muted)" }}>
        <button onClick={() => navigate("/")} className="hover:underline">Home</button>
        <span>/</span>
        <button onClick={() => navigate("/rooms")} className="hover:underline">Hotels</button>
        <span>/</span>
        <span style={{ color: "var(--color-text-primary)" }}>{room.hotel.name}</span>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              {room.hotel.name}
            </h1>
            <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: "var(--color-primary)" }}>
              {room.roomType}
            </span>
          </div>
          {/* Wishlist button */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleWishlist(room._id)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm transition-all duration-200"
            style={{
              borderColor: isWished ? "var(--color-primary)" : "var(--color-border)",
              color: isWished ? "var(--color-primary)" : "var(--color-text-secondary)",
              background: isWished ? "rgba(232,0,61,0.06)" : "transparent",
            }}>
            {isWished ? "❤️ Saved" : "🤍 Save"}
          </motion.button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <StarRating rating={4} />
            <span className="text-sm ml-1" style={{ color: "var(--color-text-muted)" }}>Reviews below</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {room.hotel.address} · {room.hotel.city}
          </div>
        </div>
      </motion.div>

      {/* ── Gallery ────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-10">
        {/* Main */}
        <div className="overflow-hidden rounded-2xl relative cursor-pointer group" style={{ boxShadow: "var(--shadow-lg)" }}
          onClick={() => setLightboxOpen(true)}>
          <img src={room.images[mainImg]} alt="Main room view"
            className="w-full h-72 lg:h-[420px] object-cover transition-transform duration-500 group-hover:scale-102" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-full">
              🔍 View all {room.images.length} photos
            </span>
          </div>
        </div>
        {/* Thumbnails */}
        <div className="grid grid-cols-2 gap-3">
          {room.images.slice(0, 4).map((img, i) => (
            <button key={i} onClick={() => { setMainImg(i); setLightboxOpen(true); }}
              className="overflow-hidden rounded-xl transition-all duration-200 relative group"
              style={{
                outline: mainImg === i ? `2px solid var(--color-primary)` : "2px solid transparent",
                outlineOffset: "2px",
                boxShadow: "var(--shadow-md)",
              }}>
              <img src={img} alt={`Room view ${i + 1}`}
                className="w-full h-28 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              {i === 3 && room.images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                  <span className="text-white font-bold text-sm">+{room.images.length - 4} more</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Content + Booking ──────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Details */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex-1 min-w-0">

          {/* Amenities grid */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
              What's Included
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {room.amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: "var(--color-surface-2)", color: "var(--color-text-secondary)" }}>
                  <span className="text-base">{AMENITY_ICONS[item] || "✨"}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Room description / policy */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>About This Room</h2>
            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
              Guests will be allocated on the ground floor according to availability.
              You get a comfortable room with a true city feeling. The price quoted is for two guests —
              at the guest slot, mark the number of guests to get the exact price for groups.
            </p>
            {roomCommonData && (
              <div className="mt-4 space-y-3">
                {roomCommonData.map((spec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <img src={spec.icon} alt={spec.title} className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{spec.title}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{spec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cancellation Policy */}
          <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            <h3 className="font-bold text-sm mb-2" style={{ color: "var(--color-text-primary)" }}>📋 Cancellation Policy</h3>
            <ul className="text-sm space-y-1" style={{ color: "var(--color-text-secondary)" }}>
              <li>✅ Free cancellation up to <strong>48 hours</strong> before check-in</li>
              <li>⚠️ 50% refund for cancellation 24–48 hours before check-in</li>
              <li>❌ No refund for cancellation within 24 hours of check-in</li>
            </ul>
          </div>

          {/* Hosted by */}
          <div className="flex items-center gap-4 p-4 rounded-2xl mb-8" style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-sm)" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-xl"
              style={{ background: "linear-gradient(135deg,#E8003D,#9B001F)" }}>
              {room.hotel.name[0]}
            </div>
            <div className="flex-1">
              <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>Hosted by {room.hotel.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)' " }}>{room.hotel.city}, India</p>
            </div>
          </div>

          {/* Map */}
          {mapCoords && (
            <div className="mb-8">
              <h3 className="font-bold text-xl font-display mb-3" style={{ color: "var(--color-text-primary)" }}>📍 Location</h3>
              <div className="rounded-2xl overflow-hidden" style={{ height: 280, boxShadow: "var(--shadow-md)" }}>
                <MapContainer center={mapCoords} zoom={14} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={mapCoords}>
                    <Popup>{room.hotel.name}<br />{room.hotel.address}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}

          {/* Reviews */}
          <ReviewSection hotelId={room.hotel._id || room.hotel} roomId={room._id} />

        </motion.div>

        {/* Right: Booking Card */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} className="lg:w-[380px] shrink-0">
          <div className="sticky top-28 rounded-2xl p-6" style={{ background: "var(--color-surface-2)", boxShadow: "var(--shadow-xl)" }}>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-5">
              <span className="font-display font-black text-3xl" style={{ color: "var(--color-primary)" }}>
                {currency}{room.pricePerNight?.toLocaleString("en-IN")}
              </span>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/night</span>
            </div>

            <form onSubmit={handleBook} className="space-y-3">
              {/* Check-In / Check-Out side by side */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Check-In",  val: checkInDate,  min: today,               set: (v) => { setCheckInDate(v); setIsAvailable(false); } },
                  { label: "Check-Out", val: checkOutDate, min: checkInDate || today, set: (v) => { setCheckOutDate(v); setIsAvailable(false); }, disabled: !checkInDate },
                ].map(({ label, val, min, set, disabled }) => (
                  <div key={label}>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-1"
                      style={{ color: "var(--color-text-secondary)" }}>{label}</label>
                    <input type="date" min={min} value={val} onChange={e => set(e.target.value)}
                      disabled={disabled} required
                      className="w-full rounded-xl px-3 py-2 text-sm border outline-none disabled:opacity-50"
                      style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
                  </div>
                ))}
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-secondary)" }}>
                  Guests
                </label>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2 border"
                  style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)" }}>
                  <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ background: "var(--color-surface-2)", color: "var(--color-text-primary)" }}>−</button>
                  <span className="flex-1 text-center text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {guests} guest{guests > 1 ? "s" : ""}
                  </span>
                  <button type="button" onClick={() => setGuests(g => Math.min(10, g + 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ background: "var(--color-primary)", color: "#fff" }}>+</button>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Payment Method
                </p>
                <PaymentTabs value={payMethod} onChange={setPayMethod} />
              </div>

              {/* Coupon */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-secondary)" }}>
                  Coupon Code
                </p>
                {coupon ? (
                  <div className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{ background: "#DCFCE7", color: "#16A34A" }}>
                    <span className="text-xs font-bold">🎟️ {coupon.code} — {coupon.discount}% off</span>
                    <button type="button" onClick={() => setCoupon(null)} className="text-xs font-bold">✕</button>
                  </div>
                ) : (
                  <CouponInput onApply={d => setCoupon({ code: d.code, discount: d.discount })} />
                )}
              </div>

              {/* Availability indicator */}
              <AnimatePresence>
                {isAvailable && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#16A34A" }}>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Available for selected dates!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Price breakdown */}
              {nights > 0 && <PriceBreakdown baseAmount={room.pricePerNight * nights} nights={nights} currency={currency} />}

              {/* Submit */}
              <button type="submit" disabled={booking}
                className="btn-primary w-full justify-center py-3.5 text-sm rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed">
                {booking ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    Processing…
                  </span>
                ) : isAvailable ? "🎉 Book Now" : "Check Availability"}
              </button>

              <p className="text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
                No charge until check-in · Free cancellation 48h before
              </p>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Similar Hotels */}
      {similarRooms.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
            More in {room.hotel.city}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {similarRooms.map((r, i) => <HotelCard key={r._id} room={r} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
