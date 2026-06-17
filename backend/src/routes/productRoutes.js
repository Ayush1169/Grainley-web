const express = require("express");

const router = express.Router();
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/admin"); 
const upload = require("../middleware/upload");

const {
createProduct,
getAllProducts,
getSingleProduct,
updateProduct,
deleteProduct,
} = require("../controllers/productController");

router.post("/", auth,isAdmin, upload.single("image"), createProduct);

router.get("/", getAllProducts);

router.get("/slug/:slug", getSingleProduct);

router.put("/:id", auth, isAdmin, updateProduct);

router.delete("/:id", auth, isAdmin, deleteProduct);

module.exports = router;
