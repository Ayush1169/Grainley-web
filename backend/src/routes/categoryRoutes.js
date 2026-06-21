const express = require("express");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/admin");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require("../controllers/categoryController");

router.post("/", auth, isAdmin, createCategory);

router.get("/", getAllCategories);

router.delete("/:id", auth, isAdmin, deleteCategory);

module.exports = router;