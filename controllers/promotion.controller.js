const Promotion = require("../models/promotion.model");
const Shop = require("../models/shop.model");
const cloudinary = require("../lib/cloudinary");
const image = "not found";

exports.add = async function (req, res) {
  try {
    const shopId = req.params.id;

    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "promo_App_Pictures",
      });
    }

    const newPromo = new Promotion({
      offer: req.body.offer,
      availability: req.body.availability,
      price: req.body.price,
      description: req.body.description,
      types: req.body.types,
      image: result?.secure_url || image,
    });

    const savedPromo = await newPromo.save();

    try {
      await Shop.findByIdAndUpdate(shopId, {
        $push: { promotion: savedPromo._id },
      });
    } catch (err) {
      res
        .status(500)
        .json({ code: 500, success: false, message: "Internal Server Error2" });
    }
    res.status(200).json({
      code: 200,
      success: true,
      data: savedPromo,
      message: "Promotion added Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error1" });
  }
};

exports.getAll = async function (req, res) {
  try {
    const promotions = await Promotion.find();
    res.status(200).json({
      code: 200,
      success: true,
      data: promotions,
      message: "All Promotions",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getOne = async function (req, res) {
  try {
    Promotion.findById(req.params.id, function (err, promo) {
      if (err) {
        return res
          .status(200)
          .json({ code: 200, success: false, message: "Invalid promo id!" });
      }
      if (promo) {
        res.status(200).json({
          code: 200,
          success: true,
          data: promo,
          message: "Promo is received",
        });
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          data: promo,
          message: "Promo is not found",
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
    let promo = await Promotion.findById(req.params.id);
    let result;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    const data = {
      offer: req.body.offer || promo.offer,
      availability: req.body.availability || promo.availability,
      price: req.body.price || promo.price,
      description: req.body.description || promo.description,
      types: req.body.types || promo.types,
      image: result?.secure_url || image || promo.image,
    };

    promo = await Promotion.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({
      code: 200,
      success: true,
      data: promo,
      message: "Promotion is Updated Successfully!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.delete = async function (req, res) {
  try {
    const shopId = req.params.shopId;
    const promo = await Promotion.findById(req.params.id);
    if (!promo) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid promo id!" });
    }
    await Promotion.findByIdAndDelete(req.params.id);

    try {
      await Shop.findByIdAndUpdate(shopId, {
        $pull: { promotion: req.params.id },
      });
    } catch (err) {
      res
        .status(500)
        .json({ code: 500, success: false, message: "Internal Server Error" });
    }

    res.status(200).json({
      code: 200,
      success: true,
      message: "Promotion "+ req.params.id +" is deleted Successfully!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};