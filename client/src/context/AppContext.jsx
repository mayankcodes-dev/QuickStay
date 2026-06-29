import axios from "axios";
import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

const TOKEN_KEY = 'yoyo_token';
const USER_KEY  = 'yoyo_user';

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate  = useNavigate();

  // ── Auth state ──────────────────────────────────────────────
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);

  // Derived from user.role — no separate state needed
  const isOwner = user?.role === 'hotelOwner';
  const isAdmin = user?.role === 'admin';

  const [showHotelReg,   setShowHotelReg]  = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms,          setRooms]         = useState([]);
  const [roomsLoaded,    setRoomsLoaded]   = useState(false);
  const [wishlist,       setWishlist]      = useState([]);

  // ── Axios auth header ───────────────────────────────────────
  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  // ── Dark mode ───────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("yoyo-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) { root.classList.add("dark");    localStorage.setItem("yoyo-theme", "dark"); }
    else          { root.classList.remove("dark"); localStorage.setItem("yoyo-theme", "light"); }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);

  // ── Auth helpers ─────────────────────────────────────────────
  const saveSession = (newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY,  JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const getToken = useCallback(async () => token, [token]);

  const register = async (username, email, password) => {
    const { data } = await axios.post('/api/auth/register', { username, email, password });
    if (data.success) { saveSession(data.token, data.user); return data; }
    throw new Error(data.message);
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    if (data.success) { saveSession(data.token, data.user); return data; }
    throw new Error(data.message);
  };

  const googleLogin = async (credential, prefetchedData = null) => {
    if (prefetchedData) { saveSession(prefetchedData.token, prefetchedData.user); return prefetchedData; }
    const { data } = await axios.post('/api/auth/google', { credential });
    if (data.success) { saveSession(data.token, data.user); return data; }
    throw new Error(data.message);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setWishlist([]);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
    toast.success('Signed out');
  };

  // ── Update user in memory (after profile edit) ───────────────
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ── Sync user data from server ───────────────────────────────
  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get('/api/user');
      if (data.success) {
        setSearchedCities(data.recentSearchedCities || []);
        setWishlist(data.wishlist?.map(id => id.toString()) || []);
        // Keep local user role in sync (e.g. after hotel registration)
        setUser(prev => prev ? { ...prev, role: data.role } : prev);
      } else {
        // Token is invalid or user no longer exists in DB (stale Clerk token, etc.)
        // Silently clear session so the user isn't stuck in a broken "logged in" state
        console.warn('[Auth] fetchUser failed — clearing stale session:', data.message);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch { /* network error — keep session, will retry on next page load */ }
  }, [token]);

  useEffect(() => { if (user) fetchUser(); }, [user?._id]);

  // ── Wishlist toggle ──────────────────────────────────────────
  const toggleWishlist = useCallback(async (roomId) => {
    if (!token) { toast.error('Please login to save rooms'); navigate('/login', { state: { from: window.location.pathname } }); return; }
    try {
      const { data } = await axios.post(`/api/user/wishlist/${roomId}`);
      if (data.success) {
        setWishlist(data.wishlist.map(id => id.toString()));
        toast.success(data.added ? '❤️ Saved to wishlist' : 'Removed from wishlist');
      }
    } catch { toast.error('Failed to update wishlist'); }
  }, [token, navigate]);

  // ── Rooms ───────────────────────────────────────────────────
  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/rooms');
      if (data.success) setRooms(data.rooms);
      else toast.error(data.message);
    } catch (err) { toast.error(err.message); }
    finally { setRoomsLoaded(true); }
  }, []);

  useEffect(() => { fetchRooms(); }, []);

  const value = {
    currency, navigate,
    user, token, getToken, axios,
    isOwner, isAdmin,
    login, logout, register, googleLogin,
    saveSession, updateUser,
    showHotelReg, setShowHotelReg,
    searchedCities, setSearchedCities,
    rooms, setRooms, fetchRooms, roomsLoaded,
    wishlist, toggleWishlist,
    darkMode, toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);