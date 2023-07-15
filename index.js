// app.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/userRouter.js");
const { mongoKey } = require("./config.js");

const app = express();
app.use(cors());
app.use(express.json({ extended: false }));

mongoose
  .connect(mongoKey)
  .then((res) => {
    console.log("Connected!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/user", userRouter);

app.use("/ping", (req, res) => {
  console.log("Req Body: ", req.body);
  return res.send({ message: "Working!" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
