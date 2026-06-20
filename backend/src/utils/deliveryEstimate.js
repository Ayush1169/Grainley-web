// backend/src/utils/deliveryEstimate.js

const OFFICE_CITY = "Bhubaneswar";
const OFFICE_STATE = "Odisha";

const NEARBY_STATES = [
  "West Bengal",
  "Jharkhand",
  "Chhattisgarh",
  "Andhra Pradesh",
];

/**
 * Returns number of days to deliver based on zone logic.
 * This is intentionally simple (no external API) — same approach
 * most early-stage D2C brands use before integrating courier
 * serviceability/pincode APIs.
 */
function getEstimatedDays(state, city) {
  if (!state) return 5; // fallback if address incomplete

  const normalizedState = state.trim().toLowerCase();
  const normalizedCity = (city || "").trim().toLowerCase();

  if (
    normalizedState === OFFICE_STATE.toLowerCase() &&
    normalizedCity === OFFICE_CITY.toLowerCase()
  ) {
    return 1; // same city
  }

  if (normalizedState === OFFICE_STATE.toLowerCase()) {
    return 2; // same state, different city
  }

  if (
    NEARBY_STATES.some((s) => s.toLowerCase() === normalizedState)
  ) {
    return 3; // nearby states
  }

  return 5; // rest of India
}

/**
 * Returns a Date object for the estimated delivery,
 * given a shipping address { state, city }.
 */
function getEstimatedDeliveryDate(shippingAddress) {
  const days = getEstimatedDays(
    shippingAddress?.state,
    shippingAddress?.city
  );

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + days);
  return estimatedDate;
}

module.exports = {
  getEstimatedDays,
  getEstimatedDeliveryDate,
};