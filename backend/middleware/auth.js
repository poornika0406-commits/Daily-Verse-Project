const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {

    const token = req.header("Authorization");

    console.log("Authorization Header:", token);

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    console.log("Actual Token:", actualToken);
const SECRET = "SECRET_KEY";

const decoded = jwt.verify(actualToken, SECRET);

    console.log("Decoded:", decoded);

    req.user = decoded;

    next();

  } catch (err) {

    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid token",
      error: err.message
    });

  }
};

module.exports = authMiddleware;