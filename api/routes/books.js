const express = require("express");
const router = express.Router();
const {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
  getOneBook,
} = require("../controllers/books");

// Route to get a specific book by ID
router.get("/:id", getOneBook);

// Route to get all books
router.get("/", getAllBooks);

// Route to add a new book
router.post("/", addBook);

// Route to delete a book by ID
router.delete("/:id", deleteBook);

// Route to update a book by ID
router.patch("/:id", updateBook);

module.exports = router;
