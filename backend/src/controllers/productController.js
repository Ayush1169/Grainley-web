const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      featured,
      sku,
      mrp,
      gst,
      hsnCode,
      packSize,
      shelfLife,
      brand,
    } = req.body;

    let imageData = [];

    if (req.file) {
      const uploadResult = await new Promise(
        (resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "ecommerce-products",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        }
      );

      imageData.push({
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      featured,

      sku,
      mrp,
      gst,
      hsnCode,
      packSize,
      shelfLife,
      brand,

      slug,

      images: imageData,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created",
      product,
    });

  } catch (error) {
  console.log("========== PRODUCT ERROR ==========");
  console.log(error);
  console.log("===================================");

  return res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category");

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Product Updated",
      product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Product Deleted",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {

    const product = await Product.findOne({
      slug: req.params.slug,
    }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};