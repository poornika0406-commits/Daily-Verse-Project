const express = require("express");
const router = express.Router();

const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =======================
// 🟢 SIGNUP
// =======================
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists ❌"
      });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({
      message: "Signup successful ✅"
    });

  }catch (err) {
  console.log("SIGNUP ERROR:", err); // 👈 ADD THIS
  res.status(500).json({
    message: "Server error",
    error: err.message
  });
}
  }
);


// =======================
// 🟢 LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found ❌"
      });
    }

    // 🔐 COMPARE HASHED PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password ❌"
      });
    }

    // 🔐 CREATE JWT TOKEN (THIS IS WHAT YOU WERE ASKING)
  const SECRET = "SECRET_KEY";

const token = jwt.sign(
  { userId: user._id },
  SECRET,
  { expiresIn: "7d" }
);
    res.json({
      message: "Login successful ✅",
      token   // ✅ send token instead of userId
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

module.exports = router;