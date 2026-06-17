const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  addToCart,
  getCart,
  updateQuantity,
  removeCart,
} = require("../controllers/cartController");

router.post("/", auth, addToCart);

router.get("/", auth, getCart);

router.put("/:id", auth, updateQuantity);

router.delete("/:id", auth, removeCart);

module.exports = router;