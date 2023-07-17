const jwt = require("jsonwebtoken");
const { jwtKey } = require("../config");
const User = require("../Model/User");

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, jwtKey); // Replace with your secret key
    req.user = decoded;

    // Check if the user exists in the database using the decoded _id
    const idToCheck = decoded._id || decoded.id;
    const user = await User.findById(idToCheck);
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found. Cannot Perform the Operation" });
    }

    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = {
  verifyToken,
};
