// const Shop = require("../models/shop.model");
const Category = require("../models/category.model");
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

    const newCat = new Category({
      catName: req.body.catName,
      image: result?.secure_url || image,
    });

    const savedCat = await newCat.save();
    res.status(200).json({
      code: 200,
      success: true,
      data: savedCat,
      message: "Category Created Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getAll = async function (req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json({
      code: 200,
      success: true,
      data: categories,
      message: "All Categories",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getOne = async function (req, res) {
  try {
    Category.findById(req.params.id, function (err, category) {
      if (err) {
        res
          .status(404)
          .json({ code: 404, success: false, message: "Category not found" });
      } else {
        res.status(200).json({
          code: 200,
          success: true,
          data: category,
          message: "Category Found",
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
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "promo_App_Pictures",
      });
    }

    Category.findById(req.params.id, function (err, category) {
      if (err) {
        res
          .status(404)
          .json({ code: 404, success: false, message: "Category not found" });
      } else {
        category.catName = req.body.catName || category.catName;
        category.image = result?.secure_url || category.image;

        category.save(function (err) {
          if (err) {
            res.status(500).json({
              code: 500,
              success: false,
              message: "Category not updated",
            });
          } else {
            res.status(200).json({
              code: 200,
              success: true,
              data: category,
              message: "Category updated",
            });
          }
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.delete = async function (req, res) {
  try {
    Category.findByIdAndRemove(req.params.id, function (err, category) {
      if (err) {
        res
          .status(404)
          .json({ code: 404, success: false, message: "Category not found" });
      } else {
        res.status(200).json({
          code: 200,
          success: true,
          data: category,
          message: "Category deleted",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
