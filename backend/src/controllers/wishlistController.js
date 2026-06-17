const Wishlist = require("../models/Wishlist");

exports.addToWishlist = async (req, res) => {
  try {

    const { productId } = req.body;

    const existing = await Wishlist.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user.id,
      product: productId,
    });

    return res.status(201).json({
      success: true,
      message: "Added To Wishlist",
      wishlist,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.getWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.find({
      user: req.user.id,
    }).populate("product");

    return res.status(200).json({
      success: true,
      wishlist,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.removeWishlist = async (req, res) => {
  try {

    await Wishlist.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Removed From Wishlist",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};