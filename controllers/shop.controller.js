const Shop = require("../models/shop.model");
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
