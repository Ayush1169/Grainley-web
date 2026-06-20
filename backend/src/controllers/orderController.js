const Order = require("../models/Order");
const { getEstimatedDeliveryDate } = require("../utils/deliveryEstimate");

exports.createOrder = async (req, res) => {
  try {

    const {
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const estimatedDate = new Date();
estimatedDate.setDate(
  estimatedDate.getDate() + 7
);

    const order = await Order.create({
  user: req.user.id,
  products,
  totalAmount,
  shippingAddress,
  paymentMethod,

  trackingId: "NS" + Date.now(),

  estimatedDeliveryDate: estimatedDate,

  tracking: {
    orderPlacedAt: new Date(),
  },
});

    return res.status(201).json({
      success: true,
      message: "Order Created",
      order,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("products.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user")
      .populate("products.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, courierName, courierTrackingId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update status
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    // Courier details — only set when admin provides them (usually at "Shipped")
    if (courierName) order.courierName = courierName;
    if (courierTrackingId) order.courierTrackingId = courierTrackingId;

    // Auto-stamp tracking timeline based on status change
    const now = new Date();
    if (orderStatus === "Packed" && !order.tracking.packedAt) {
      order.tracking.packedAt = now;
    }
    if (orderStatus === "Shipped" && !order.tracking.shippedAt) {
      order.tracking.shippedAt = now;
    }
    if (orderStatus === "Out For Delivery" && !order.tracking.outForDeliveryAt) {
      order.tracking.outForDeliveryAt = now;
    }
    if (orderStatus === "Delivered" && !order.tracking.deliveredAt) {
      order.tracking.deliveredAt = now;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order Updated",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDeliveryEstimate = async (req, res) => {
  try {
    const { state, city } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required",
      });
    }

    const estimatedDate = getEstimatedDeliveryDate({ state, city });

    return res.status(200).json({
      success: true,
      estimatedDeliveryDate: estimatedDate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;

    const estimatedDate = getEstimatedDeliveryDate(shippingAddress);

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      trackingId: "NS" + Date.now(),
      estimatedDeliveryDate: estimatedDate,
      tracking: { orderPlacedAt: new Date() },
    });

    return res.status(201).json({ success: true, message: "Order Created", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product")
      .populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Security check: a normal user can only view their own order.
    // Admins can view any order.
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};