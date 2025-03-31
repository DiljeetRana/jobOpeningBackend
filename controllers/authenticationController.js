require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const redis = require("redis");

const app = express();
app.use(express.json());

// Redis Client (optional for better performance)
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // App password
  },
});

// Generate OTP and Send via Email
app.post("/generate-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: "5m" });

  // Save OTP in Redis (optional)
  await redisClient.set(email, otp, { EX: 300 });

  // Send OTP via Email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully", otpToken });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { email, otp, otpToken } = req.body;
  if (!email || !otp || !otpToken) return res.status(400).json({ message: "All fields are required" });

  try {
    // Verify JWT
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    if (decoded.email !== email) return res.status(400).json({ message: "Invalid email" });

    // Check OTP in Redis
    const storedOtp = await redisClient.get(email);
    if (!storedOtp || storedOtp !== otp) return res.status(400).json({ message: "Invalid or expired OTP" });

    // OTP is correct
    await redisClient.del(email); // Remove OTP from Redis after successful verification
    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired OTP token", error });
  }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
