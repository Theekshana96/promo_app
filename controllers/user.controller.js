const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const utils = require("../lib/utils");
const cloudinary = require("../lib/cloudinary");
const image = "https://res.cloudinary.com/hit-project-foot/image/upload/v1677339280/promo_App_Pictures/tzuhsimm5a8vnie5kss6.jpg";

exports.register = async function (req, res) {
  try {
    
    const emailExit = await User.findOne({ email: req.body.email });
    if (emailExit) {
      return res.status(400).send("Email already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
      phone: req.body.phone,
      image: image,
    });

    const savedUser = await newUser.save();
    const token = utils.generateAuthToken(savedUser);
    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      message: "Registered Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.login = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Email" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Password" });
    const token = utils.generateAuthToken(user);
    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      message: "logged in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getUsers = async function (req, res) {
  try {
    const users = await User.find();
    res.status(200).json({
      code: 200,
      success: true,
      users: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getUser = async function (req, res) {
  try {
    User.findById(req.params.id, function (err, user) {
      if (err) {
        return res
          .status(200)
          .json({ code: 200, success: false, message: "Invalid user!" });
      }
      if (user) {
        res.status(200).json({
          code: 200,
          success: true,
          data: user,
          message: "User is received",
        });
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          data: user,
          message: "User is not found",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.updateUser = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    let result;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    const data = {
      name: req.body.name || user.name,
      image: result?.secure_url || user.image,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
    };

    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      code: 200,
      success: true,
      data: user,
      message: "User Updated Successfully!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
