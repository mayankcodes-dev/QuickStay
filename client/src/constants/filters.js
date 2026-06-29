/**
 * Shared filter constants for room search/filter UI.
 * Single source of truth — used in AllRooms and any future filter components.
 */

export const ROOM_TYPES = [
  "Single Bed",
  "Double Bed",
  "Family Suite",
  "Luxury Suite",
  "Mountain View Cottage",
  "Heritage Suite",
  "Business Suite",
];

export const PRICE_RANGES = [
  "Under ₹1,000",
  "₹1,000 – ₹2,500",
  "₹2,500 – ₹5,000",
  "₹5,000 – ₹10,000",
  "Above ₹10,000",
];

export const CATEGORIES = ["Budget", "Premium", "Luxury", "Villa", "Business"];

export const SORT_OPTIONS = [
  "Price: Low to High",
  "Price: High to Low",
  "Top Rated",
  "Newest First",
];

/**
 * Returns true if room.pricePerNight falls within any selected price range.
 */
export const matchesPrice = (room, priceRange) => {
  if (!priceRange.length) return true;
  return priceRange.some((range) => {
    const p = room.pricePerNight;
    if (range === "Under ₹1,000")      return p < 1000;
    if (range === "₹1,000 – ₹2,500")  return p >= 1000 && p <= 2500;
    if (range === "₹2,500 – ₹5,000")  return p >= 2500 && p <= 5000;
    if (range === "₹5,000 – ₹10,000") return p >= 5000 && p <= 10000;
    if (range === "Above ₹10,000")     return p > 10000;
    return false;
  });
};

/** Default empty filter state */
export const EMPTY_FILTERS = { roomType: [], priceRange: [], category: [], stars: [] };
