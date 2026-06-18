const Address = require("../models/Address");

exports.createAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Address Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.setDefaultAddress = async (
  req,
  res
) => {
  try {
    await Address.updateMany(
      {
        user: req.user.id,
      },
      {
        isDefault: false,
      }
    );

    const address =
      await Address.findByIdAndUpdate(
        req.params.id,
        {
          isDefault: true,
        },
        {
          new: true,
        }
      );

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};