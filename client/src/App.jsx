import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";
import Loader      from "./components/Loader";
import HotelReg    from "./components/HotelReg";
import PageTransition from "./components/PageTransition";
import MayaChatbot from "./components/MayaChatbot";

// ── Lazy-loaded pages (code splitting) ────────────────────────
const Home               = lazy(() => import("./pages/Home"));
const AllRooms           = lazy(() => import("./pages/AllRooms"));
const RoomDetails        = lazy(() => import("./pages/RoomDetails"));
const MyBookings         = lazy(() => import("./pages/MyBookings"));
const Login              = lazy(() => import("./pages/Login"));
const Register           = lazy(() => import("./pages/Register"));
const UserProfile        = lazy(() => import("./pages/UserProfile"));
const BookingConfirmation= lazy(() => import("./pages/BookingConfirmation"));

// Hotel owner panel
const Layout     = lazy(() => import("./pages/hotelOwner/Layout"));
const Dashboard  = lazy(() => import("./pages/hotelOwner/Dashboard"));
const AddRoom    = lazy(() => import("./pages/hotelOwner/AddRoom"));
const ListRoom   = lazy(() => import("./pages/hotelOwner/ListRoom"));
const EditHotel  = lazy(() => import("./pages/hotelOwner/EditHotel"));

// Admin panel
const AdminLayout    = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminHotels    = lazy(() => import("./pages/admin/AdminHotels"));
const AdminUsers     = lazy(() => import("./pages/admin/AdminUsers"));

// ── Suspense fallback ─────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-surface)" }}>
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 rounded-full animate-spin"
        style={{ borderColor: "var(--color-primary) transparent transparent transparent" }} />
      <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Loading…</p>
    </div>
  </div>
);

const App = () => {
  const { pathname } = useLocation();
  const { showHotelReg } = useAppContext();

  const isOwnerPath = pathname.startsWith("/owner");
  const isAdminPath = pathname.startsWith("/admin");
  const isAuthPage  = pathname === "/login" || pathname === "/register";
  const hideShell   = isOwnerPath || isAdminPath || isAuthPage;

  return (
    <HelmetProvider>
      <div style={{ background: "var(--color-surface)" }}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-surface-2)",
              color:      "var(--color-text-primary)",
              border:     "1px solid var(--color-border)",
              borderRadius: "12px",
              fontSize:   "14px",
            },
          }}
        />

        {!hideShell && <Navbar />}
        {showHotelReg && <HotelReg />}

        {/* Maya AI Chatbot — shown on public pages only */}
        {!hideShell && <MayaChatbot />}

        <div className={`min-h-[70vh] ${!hideShell ? "pt-16" : ""}`}>
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Routes>
                {/* Public */}
                <Route path="/"                          element={<Home />} />
                <Route path="/rooms"                     element={<AllRooms />} />
                <Route path="/rooms/:id"                 element={<RoomDetails />} />
                <Route path="/login"                     element={<Login />} />
                <Route path="/register"                  element={<Register />} />
                <Route path="/loader/:nextUrl"           element={<Loader />} />

                {/* Authenticated user */}
                <Route path="/my-bookings"               element={<MyBookings />} />
                <Route path="/profile"                   element={<UserProfile />} />
                <Route path="/booking-confirmation/:id"  element={<BookingConfirmation />} />

                {/* Hotel Owner panel */}
                <Route path="/owner" element={<Layout />}>
                  <Route index            element={<Dashboard />} />
                  <Route path="add-room"  element={<AddRoom />} />
                  <Route path="list-room" element={<ListRoom />} />
                  <Route path="edit-hotel" element={<EditHotel />} />
                </Route>

                {/* Admin panel */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index            element={<AdminDashboard />} />
                  <Route path="hotels"    element={<AdminHotels />} />
                  <Route path="users"     element={<AdminUsers />} />
                </Route>
              </Routes>
            </PageTransition>
          </Suspense>
        </div>

        {!hideShell && <Footer />}
      </div>
    </HelmetProvider>
  );
};

export default App;