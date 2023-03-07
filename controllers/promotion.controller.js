const Promotion = require("../models/promotion.model");
const Shop = require("../models/shop.model");
const cloudinary = require("../lib/cloudinary");
const image = "not found";
const mongoose = require("mongoose");

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
      shop: shopId,
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
    Promotion.aggregate([
      {
        $lookup: {
          from: "shops",
          localField: "shop",
          foreignField: "_id",
          as: "shop",
        },
      },
      {
        $project: {
          _id: 1,
          offer: 1,
          availability: 1,
          price: 1,
          description: 1,
          types: 1,
          image: 1,
          shop: "$shop.name",
        },
      },
    ]).exec(function (err, promotions) {
      if (err) {
        return res
          .status(200)
          .json({ code: 200, success: false, message: "Invalid promo id!" });
      }
      if (promotions) {
        res.status(200).json({
          code: 200,
          success: true,
          data: promotions,
          message: "Promotions are received",
        });
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          data: promotions,
          message: "Promotions are not found",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getOne = async function (req, res) {
  try {
    Promotion.aggregate([
      {
        $lookup: {
          from: "shops",
          localField: "shop",
          foreignField: "_id",
          as: "shop",
        },
      },
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $project: {
          _id: 1,
          offer: 1,
          availability: 1,
          price: 1,
          description: 1,
          types: 1,
          image: 1,
          shop: "$shop.name",
        },
      },
    ]).exec(function (err, promotion) {
      if (err) {
        return res
          .status(200)
          .json({ code: 200, success: false, message: "Invalid promo id!" });
      }
      if (promotion) {
        res.status(200).json({
          code: 200,
          success: true,
          data: promotion,
          message: "Promotion is received",
        });
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          data: promotion,
          message: "Promotion is not found",
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
      result = await cloudinary.uploader.upload(req.file.path,{
        folder: "promo_App_Pictures",
      });
    }

    const data = {
      offer: req.body.offer || promo.offer,
      availability: req.body.availability || promo.availability,
      price: req.body.price || promo.price,
      description: req.body.description || promo.description,
      types: req.body.types || promo.types,
      image: result?.secure_url || promo.image,
      shop: req.body.shop || promo.shop,
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
    const promo = await Promotion.findById(req.params.id);
    const shopId = promo.shop;
    console.log("shopId", shopId);
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
      message: "Promotion " + req.params.id + " is deleted Successfully!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
