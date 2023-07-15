const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  jwtKey: process.env.JWT_KEY,
  mongoKey: process.env.MONGO_URI,
};
