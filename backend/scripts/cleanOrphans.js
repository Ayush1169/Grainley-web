// backend/scripts/cleanOrphans.js
const mongoose = require("mongoose");
require("dotenv").config();

const Cart = require("../src/models/Cart");
const Wishlist = require("../src/models/Wishlist");
const Product = require("../src/models/Product");

async function cleanOrphans() {
  await mongoose.connect(process.env.MONGO_URI);

  const carts = await Cart.find();
  let removedCart = 0;
  for (const item of carts) {
    const exists = await Product.findById(item.product);
    if (!exists) {
      await Cart.findByIdAndDelete(item._id);
      removedCart++;
    }
  }

  const wishlists = await Wishlist.find();
  let removedWishlist = 0;
  for (const item of wishlists) {
    const exists = await Product.findById(item.product);
    if (!exists) {
      await Wishlist.findByIdAndDelete(item._id);
      removedWishlist++;
    }
  }

  console.log(`Removed ${removedCart} orphan cart items`);
  console.log(`Removed ${removedWishlist} orphan wishlist items`);

  await mongoose.disconnect();
}

cleanOrphans();