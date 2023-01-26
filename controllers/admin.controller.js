const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const utils = require("../lib/utils");

exports.register = async function (req, res) {
  try {
    const emailExit = await Admin.findOne({ email: req.body.email });
    if (emailExit) {
      return res.status(400).send("Email already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(req.body.password, salt);

    const newAdmin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
    });

    const savedAdmin = await newAdmin.save();
    const token = utils.generateAdminAuthToken(savedAdmin);
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
    const admin = await Admin.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!admin)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Email" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    if (!validPassword)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Password" });
    const token = utils.generateAdminAuthToken(admin);
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