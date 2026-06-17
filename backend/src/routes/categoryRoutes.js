const express = require("express");
const { isAdmin } = require("../middleware/admin");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require("../controllers/categoryController");

router.post("/", isAdmin, createCategory);

router.get("/", getAllCategories);

router.delete("/:id", isAdmin, deleteCategory);

module.exports = router;