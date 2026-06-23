const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  addToCart,
  getCart,
  updateQuantity,
  removeCart,
   mergeCart,
} = require("../controllers/cartController");

router.post("/", auth, addToCart);

router.post("/merge", auth, mergeCart);

router.get("/", auth, getCart);

router.put("/:id", auth, updateQuantity);

router.delete("/:id", auth, removeCart);

module.exports = router;