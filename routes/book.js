const express = require("express");
const router = express.Router();
const {
  addBook,
  deleteBook,
  getAllBooks,
  getAllUserCreated,
  getAllUserSaved,
  saveBook,
  removeBook,
  toggleHeart,
  addComment,
  deleteComment,
  getOneBook,
} = require("../controllers/books");

//Get one Book
router.post("/one", getOneBook);
//Get all Books
router.get("/all", getAllBooks);
//Get Books from users createdUsers
router.get("/allUserArray", getAllUserCreated);
//Get Books from users savedFavorites
router.get("/allSavedArray", getAllUserSaved);
//Post new Book (append to createdFavoritesArray)
router.post("/addBook", addBook);
//Save favorite
router.post("/saveBook", saveBook);
//Remove favorite
router.post("/removeBook", removeBook);
//Toggle saved/removed favorite
router.post("/toggleHeart", toggleHeart);
//Delete a book
router.delete("/delete", deleteBook);
//Add comment to book
router.post("/addComment", addComment);
//Delete comment from book
router.post("/deleteComment", deleteComment);

module.exports = router;
