const express = require("express");

const router = express.Router();

const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/admin");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDeliveryEstimate,
  getOrderById
} = require("../controllers/orderController");

router.post("/", auth, createOrder);

router.get("/my-orders", auth, getMyOrders);

router.get("/estimate", getDeliveryEstimate);

router.get("/:id", auth, getOrderById);

router.get(
  "/admin/all",
  auth,
  isAdmin,
  getAllOrders
);

router.put(
  "/admin/:id",
  auth,
  isAdmin,
  updateOrderStatus
);

module.exports = router;