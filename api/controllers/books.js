const Book = require("../models/books");
const axios = require("axios");

const addBook = async (req, res) => {
  const userReponse = await axios.get(`/api/models/user.js/${req.user.userID}`);
  const User = userReponse.data;

  const newBook = {
    title: req.body.title,
    description: req.body.description,
    completed: false,
    chapters: [],
  };
  const book = await Book.create(newBook);
  if (!book) {
    throw new Error("Incorrect");
  }
  console.log("bookId:", book.id);

  const user = await User.findById({ _id: req.user.userID });
  if (!user) {
    throw new Error(
      `Bad Authentication while updating user ${req.user.userID}`
    );
  }
  user.saveBook(book.id, true);
  console.log(`${user.userName} Created Book: ${newBook.title}`);
  res.json(book);
};
const updateBook = async (req, res) => {
  const bookId = req.params.id; // assuming the book ID is passed as a URL parameter
  const updatedFields = {
    title: req.body.title,
    description: req.body.description,
  };

  // Remove undefined fields
  Object.keys(updatedFields).forEach((key) =>
    updatedFields[key] === undefined ? delete updatedFields[key] : {}
  );

  const book = await Book.findByIdAndUpdate(bookId, updatedFields, {
    new: true,
  }); // { new: true } option returns the updated document

  if (!book) {
    throw new Error(`No book found with id: ${bookId}`);
  }

  res.json(book);
};
const deleteBook = async (req, res) => {
  const bookForDeletion = {
    bookID: req.body.id,
  };
  const lookUpBook = await Book.findById(bookForDeletion.bookID);
  if (!lookUpBook) {
    throw new Error(`Could not find book with id:${bookForDeletion.bookID}`);
  } else {
    if (lookUpBook.createdBy == req.user.userID) {
      const deletedBook = await Book.findOneAndRemove({
        _id: bookForDeletion.bookID,
      });
      if (!deletedBook) {
        throw new Error("Deletion Unsuccessful");
      }
      console.log(`${req.user.name} deleted book ${deletedBook.title}`);
      res.json(`Removed ${deletedBook.title}`);
    } else {
      throw new Error(`You can not delete someone elses book`);
    }
  }
};
const saveBook = async (req, res) => {
  try {
    const user = await User.findById(req.user.userID);
    if (!user) {
      return res
        .status(401)
        .json({ error: `User not found with ID ${req.user.userID}` });
    }

    const book = await Book.findOne({ _id: req.body._id });
    if (!book) {
      return res.status(404).json({ error: "Unable to find book" });
    }

    const saveResult = await user.saveBook(book._id, false);
    if (!saveResult) {
      return res.status(500).json({ error: "Failed to save book" });
    }

    console.log(`${user.userName} saved ${book.title}`);
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getOneBook = async (req, res) => {
  const requestData = {
    _id: req.body._id,
  };
  const book = await Book.findOne({ _id: requestData._id });
  if (!book) {
    throw new Error("Could not find that book");
  }
  res.json(book);
};

const getAllBooks = async (req, res) => {
  const allBooks = await Book.find();
  res.status(200).json({ allBooks, count: allBooks.length });
};

module.exports = {
  addBook,
  updateBook,
  saveBook,
  deleteBook,
  getOneBook,
  getAllBooks,
};
