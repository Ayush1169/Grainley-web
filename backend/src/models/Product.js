const mongoose = require("mongoose");
const Cart = require("./Cart");
const Wishlist = require("./Wishlist");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

   sku: {
  type: String,
  required: true,
  unique: true,
},

mrp: {
  type: Number,
  required: true,
},

gst: {
  type: Number,
  default: 0,
},

hsnCode: {
  type: String,
},

packSize: {
  type: String,
},

shelfLife: {
  type: String,
},

brand: {
  type: String,
  default: "Grainley Foods",
},

slug: {
  type: String,
  unique: true,
},

  },
  {
    timestamps: true,
  }
);

// Whenever a product is deleted via findByIdAndDelete / findOneAndDelete,
// automatically clean up any Cart/Wishlist entries pointing to it —
// so no controller ever has to remember to do this manually.
productSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return; // nothing was actually deleted
  await Cart.deleteMany({ product: doc._id });
  await Wishlist.deleteMany({ product: doc._id });
});

module.exports = mongoose.model(
  "Product",
  productSchema
);