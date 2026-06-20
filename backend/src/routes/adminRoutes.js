const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/admin");

const {getDashboardStats,getAllUsers,} = require("../controllers/adminController");

const { getAllCustomers } = require("../controllers/adminController");

router.get("/stats", auth,isAdmin,getDashboardStats
);

router.get(
  "/users",
  auth,
  isAdmin,
  getAllUsers
);

router.get("/customers", auth, isAdmin, getAllCustomers);

module.exports = router;