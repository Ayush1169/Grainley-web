const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  try {

    const { productId } = req.body;

    const existing = await Cart.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existing) {

      existing.quantity += 1;

      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Cart Updated",
        cart: existing,
      });
    }

    const cart = await Cart.create({
      user: req.user.id,
      product: productId,
      quantity: 1,
    });

    return res.status(201).json({
      success: true,
      message: "Added To Cart",
      cart,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.getCart = async (req, res) => {
  try {

    const cart = await Cart.find({
      user: req.user.id,
    }).populate("product");

    return res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.updateQuantity = async (req, res) => {
  try {

    const { quantity } = req.body;

    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        quantity,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Quantity Updated",
      cart,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.removeCart = async (req, res) => {
  try {

    await Cart.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Removed From Cart",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


exports.mergeCart = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(200).json({ success: true, message: "Nothing to merge" });
    }

    for (const item of items) {
      const { productId, quantity } = item;
      if (!productId || !quantity) continue;

      const existing = await Cart.findOne({
        user: req.user.id,
        product: productId,
      });

      if (existing) {
        existing.quantity += quantity;
        await existing.save();
      } else {
        await Cart.create({
          user: req.user.id,
          product: productId,
          quantity,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Cart merged",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};