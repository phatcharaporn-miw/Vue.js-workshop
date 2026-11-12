import { getSavedUserProfile, getTokenPayload } from "@/services/auth";

export function getUserId() {
  const payload = getTokenPayload();
  const profile = getSavedUserProfile();

  return (
    (payload && (payload.id || payload._id || payload.userId || payload.sub)) ||
    (profile &&
      (profile._id ||
        profile.id ||
        profile.username)) ||
    null
  );
}

export function getCartKey() {
  const userId = getUserId();

  return userId ? `cart_${encodeURIComponent(String(userId))}` : null;
}

export function getCart() {
  const key = getCartKey();

  if (!key) return [];

  const storedCart = localStorage.getItem(key);

  if (!storedCart) return [];

  try {
    const cart = JSON.parse(storedCart);
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    console.error("Cannot read saved cart:", error);
    return [];
  }
}

export function saveCart(cart) {
  const key = getCartKey();

  if (!key) return false;

  localStorage.setItem(key, JSON.stringify(cart));
  return true;
}