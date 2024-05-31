const express = require("express");
const router = express.Router();
const {
  addBook,
  deleteBook,
  getAllBooks,
  getAllUserCreated,
  getAllUserSaved,
  updateBook,
  saveBook,
  removeBook,
  toggleHeart,
  getOneBook,
} = require("../controllers/books");

router.post("/one", getOneBook);
router.get("/all", getAllBooks);
router.get("/allUserArray", getAllUserCreated);
router.get("/allSavedArray", getAllUserSaved);
router.post("/addBook", addBook);
router.post("/saveBook", saveBook);
router.post("/removeBook", removeBook);
router.post("/toggleHeart", toggleHeart);
router.delete("/delete", deleteBook);
router.patch("/books/:id", updateBook);

module.exports = router;
