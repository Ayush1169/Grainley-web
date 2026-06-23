import axios from "axios";

const GUEST_CART_KEY = "guestCart";

export interface GuestCartItem {
  productId: string;
  quantity: number;
}

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: GuestCartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  // tells Navbar (and any other listener) that guest cart changed
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("guestCartUpdated"));
  }
}

export function getGuestCartQty(productId: string): number {
  return getGuestCart().find((i) => i.productId === productId)?.quantity || 0;
}

// returns the new quantity after adding
export function addToGuestCart(productId: string): number {
  const items = getGuestCart();
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ productId, quantity: 1 });
  }
  saveGuestCart(items);
  return existing ? existing.quantity : 1;
}

export function updateGuestCartQty(productId: string, quantity: number) {
  let items = getGuestCart();
  if (quantity <= 0) {
    items = items.filter((i) => i.productId !== productId);
  } else {
    const existing = items.find((i) => i.productId === productId);
    if (existing) existing.quantity = quantity;
    else items.push({ productId, quantity });
  }
  saveGuestCart(items);
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((acc, i) => acc + i.quantity, 0);
}

export function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

// called right after a successful login — pushes guest cart into the
// user's real backend cart, then clears localStorage
export async function mergeGuestCartIfAny(token: string) {
  const items = getGuestCart();
  if (items.length === 0) return;

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/merge`,
      { items },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    clearGuestCart();
  } catch (error) {
    console.log(error);
  }
}