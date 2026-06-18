const express = require("express");

const {
  createAddress,
  getMyAddresses,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createAddress);

router.get("/", auth, getMyAddresses);

router.delete(
  "/:id",
  auth,
  deleteAddress
);

router.put(
  "/default/:id",
  auth,
  setDefaultAddress
);

module.exports = router;