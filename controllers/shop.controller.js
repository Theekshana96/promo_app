const Shop = require("../models/shop.model");
const Promotion = require("../models/promotion.model");
const cloudinary = require("../lib/cloudinary");
const image = "not found";

exports.create = async function (req, res) {
  try {
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "promo_App_Pictures",
      });
    }

    const newShop = new Shop({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      location: req.body.location,
      lat: req.body.lat,
      lng: req.body.lng,
      email: req.body.email,
      phone: req.body.phone,
      image: result?.secure_url || image,
    });

    const savedShop = await newShop.save();
    res.status(200).json({
      code: 200,
      success: true,
      data: savedShop,
      message: "Shop Created Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getAll = async function (req, res) {
  try {
    const shops = await Shop.find();
    res.status(200).json({
      code: 200,
      success: true,
      data: shops,
      message: "All Shops",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getOne = async function (req, res) {
  try {
    Shop.findById(req.params.id, function (err, shop) {
      if (err) {
        return res
          .status(200)
          .json({ code: 200, success: false, message: "Invalid shop id!" });
      }
      if (shop) {
        res.status(200).json({
          code: 200,
          success: true,
          data: shop,
          message: "Shop is received",
        });
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          data: user,
          message: "Shop is not found",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.update = async function (req, res) {
  try {
    let shop = await Shop.findById(req.params.id);
    let result;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    const data = {
      name: req.body.name || shop.name,
      category: req.body.category || shop.category,
      description: req.body.description || shop.description,
      location: req.body.location || shop.location,
      lat: req.body.lat || shop.lat,
      lng: req.body.lng || shop.lng,
      email: req.body.email || shop.email,
      phone: req.body.phone || shop.phone,
      image: result?.secure_url || shop.image,
    };

    shop = await Shop.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      code: 200,
      success: true,
      data: shop,
      message: "Shop Updated Successfully!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.delete = async function (req, res) {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.status(200).json({
      code: 200,
      success: true,
      message: "Shop Deleted Successfully!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

//getShopsByCategory
exports.getShopsByCategory = async function (req, res) {
  try {
    const shops = await Shop.find({ category: req.params.category });
    if (!shops)
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: "No shops found in this category",
        });
    res.status(200).json({
      code: 200,
      success: true,
      data: shops,
      message: "All Shops",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getAllPromotionsByShop = async function (req, res) {
  try {
    const shop = await Shop.findById(req.params.id);
    const list = await Promise.all(
      shop.promotion.map((promo) => {
        return Promotion.findById(promo);
      })
    );

    res.status(200).json({
      code: 200,
      success: true,
      data: list,
      message: "All Promotions",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
