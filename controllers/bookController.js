const Book = require("../Model/Book");

exports.getBooks = async (req, res) => {
  console.log("req: ", req.user);
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSingleBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!bookId) return res.status(404).json({ message: "Missing Book Id!" });
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { action, historyObject } = req.body;
    const bookId = req.params.id; // _id
    if (!historyObject || !action) {
      return res.status(400).json({ message: "Missing required fields!" });
    }
    let book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    // Create a new checkIn record
    let newHistoryObj = {
      ...historyObject,
    };

    if (action === "check-out") {
      // Mark the book as unavailable (checked out)
      book.availability = false;
      // Set the default check-in date to 15 days from the current date
      const defaultCheckInDate = addWeekdaysToDate(
        // historyObject.checkInDate, //! uncomment this
        new Date(),
        15
      );
      newHistoryObj.defaultCheckInDate = defaultCheckInDate;
    } else if (action === "check-in") {
      // Mark the book as available (checked in)
      book.availability = true;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Add the new checkIn record to the checkInOutHistory array
    book.checkInOutHistory.push(newHistoryObj);

    // Save the updated book in the database
    await book.save();
    return res.status(200).send({ book, message: "Book Details Updated!" });
  } catch (error) {
    console.error("Error from update Book api", error);
    return res.status(500).send({ message: "Internal Server Error", error });
  }
};

const addWeekdaysToDate = (date, daysToAdd) => {
  const resultDate = new Date(date);
  let daysAdded = 0;

  while (daysAdded < daysToAdd) {
    resultDate.setDate(resultDate.getDate() + 1);

    // Check if the current day is not a weekend (Saturday or Sunday)
    if (resultDate.getDay() !== 0 && resultDate.getDay() !== 6) {
      daysAdded++;
    }
  }
  return resultDate;
};
