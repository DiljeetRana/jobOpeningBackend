const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const nodemailer = require("nodemailer");
require('dotenv').config();

// Register User (Admin/HR)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email); // Debug log

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(400).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
exports.forgot = async (req, resp) => {
  const dataa = req.body;
  console.log("email :>> ", dataa.email);
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log("otp :>> ", otp);
  const otphash = await bcrypt.hash(otp.toString(), 10);
  const otpexpire = Date.now() + 10 * 60 * 1000;


  const data = await User.findOne({ email: dataa.email });
  if (!data) {
    return resp.status(400).json({
      success: false,
      message: "Email does not exist",
    });
  }
  await User.findByIdAndUpdate(data._id, {
    otpHash: otphash,
    otpExpire: otpexpire,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER, // sender address
    to: dataa.email, // list of receivers
    subject: "Reset Password", // Subject line
    text: `Your Reset Password Otp is ${otp}`, // plain text body
  });

  return resp.status(200).json({
    success: true,
    message: "successfully",
    user: data
  });
};
exports.Verify = async (req, resp) => {
  const { otp } = req.body;
  const { id } = req.params;
  console.log("otp :>> ", otp);
  console.log(id);
  const user = await User.findById(id);
  if (!user) {
    return resp.status(400).json({
      success: false,
      message: "user not found",
    });
  }
  if (Date.now() > user?.otpExpire) {
    return resp.status(400).json({
      success: false,
      message: "Otp Expired",
    });
  }
  console.log(user);
  console.log(typeof otp);
  console.log(user.otpHash);
  const isMatch = await bcrypt.compare(otp, user.otpHash);
  if (!isMatch) {
    return resp.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  } else {
    return resp.status(200).json({
      success: true,
      message: "OTP Verified",
    });
  }
};
exports.Resetpass = async (req, resp) => {
  const { password } = req.body;
  const { id } = req.params;
  const hashPassword = await bcrypt.hash(password, 10);
  const data = await User.findByIdAndUpdate(id, { password: hashPassword });
  console.log(data);
  if (data) {
    return resp.status(200).json({
      data: data,
      success: true,
      message: "password reset successfully",
    });
  } else {
    return resp.status(400).json({
      data: data,
      success: false,
      message: "password not reset",
    });
  }
};
exports.ChangePassword = async (req, resp) => {
  const { id } = req.params;
  const { newPass, oldPass } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return resp.status(400).json({
      success: false,
      message: "user not exist",
    });
  }
  const password = user?.password;
  const newhashPass = await bcrypt.hash(newPass, 3);
  // const newhashPass = await bcrypt.hash(newPass.toString(), 3);

  const match = await bcrypt.compare(oldPass, password);
  if (!match) {
    return resp.status(400).json({
      success: false,
      message: "old password not match",
    });
  }
  console.log(newhashPass);
  const update = await User.findByIdAndUpdate(id, {
    password: newhashPass,
  });
  if (update) {
    return resp.status(200).json({
      success: true,
      message: "password change successfully",
    });
  } else {
    return resp.status(400).json({
      success: false,
      message: "password not change",
    });
  }
};