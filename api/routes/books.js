const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
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
router.post("/create", auth, addBook);

// Route to delete a book by ID
router.delete("/delete/:id", auth, deleteBook );

// Route to update a book by ID
router.patch("/update/:id", auth, updateBook );

module.exports = router;
