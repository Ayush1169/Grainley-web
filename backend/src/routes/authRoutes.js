const express = require("express");

const router = express.Router();

const {
  sendOTP,
  verifyOTPAndSignup,
  login,
  createAdmin,
} = require("../controllers/authController");

router.post("/send-otp", sendOTP);
router.post("/signup", verifyOTPAndSignup);
router.post("/login", login);
router.post("/create-admin", createAdmin);

module.exports = router;