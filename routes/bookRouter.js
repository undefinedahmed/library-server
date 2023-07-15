const express = require("express");
const router = express.Router();
const BookController = require("../controllers/bookController");
const { verifyToken } = require("../middleware");

router.get("/", verifyToken, BookController.getBooks);
router.post("/:id/update-book", verifyToken, BookController.updateBook);

module.exports = router;
