const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
    },
    publishYear: {
      type: String,
      required: true,
    },
    coverPrice: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      required: true,
    },
    checkInOutHistory: {
      type: Array,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
