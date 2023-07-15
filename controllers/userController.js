const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Model/User");
const { jwtKey } = require("../config");

exports.signup = async (req, res) => {
  try {
    const { name, email, nationalIdentity, phoneNumber, password } = req.body;
    if (!(name && email && nationalIdentity && phoneNumber && password)) {
      return res
        .status(400)
        .json({ message: "Missing required fields", status: 400 });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        message: "Woops! This email already exists. Try out with a new one.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      nationalIdentity,
      phoneNumber,
      password: hashedPassword,
    });
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, jwtKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "User created successfully" });
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Req Body: ", req.body);
    const { email, password } = req.body;
    if (!(email && password)) {
      return res
        .status(400)
        .send({ message: "Please Enter Email & Password!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Woops! User Not found." });
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ email: user.email, id: user._id }, jwtKey, {
        expiresIn: "1h",
      });

      return res.status(200).send({
        message: "Login Successful",
        token,
      });
    }
    return res.status(401).send({ message: "Woops! Wrong Credentials" });
  } catch (error) {
    console.error("Error from login api", error);
    return res.status(500).send({ message: "Internal Server Error", error });
  }
};
