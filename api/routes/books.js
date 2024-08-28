const express = require("express");
const router = express.Router();
const {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
  saveBook,
  getOneBook,
} = require("../controllers/books");

router.post("/one", getOneBook);
router.get("/all", getAllBooks);
router.post("/addBook", addBook);
router.post("/saveBook", saveBook);
router.delete("/delete", deleteBook);
router.patch("/books/:id", updateBook);

module.exports = router;
