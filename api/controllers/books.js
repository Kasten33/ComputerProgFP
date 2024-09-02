const Book = require("../models/books");
const User = require("../models/user");
const mongodb = require('../DB/connect');
const mongoose = require('mongoose');

const addBook = async (req, res) => {
  try {
   // Create a new book object
   const newBook = {
    title: req.body.title,
    description: req.body.description,
    completed: false,
    chapters: [],
  };

  // Insert the new book into the books collection
  const bookResult = await mongodb.getDb().db().collection('books').insertOne(newBook);
  if (!bookResult.insertedId) {
    throw new Error('Failed to create book');
  }

  // Find the user by their ID
  const userId = new mongoose.Types.ObjectId(req.user._id); // Assuming req.user._id is set by the auth middleware
  const user = await mongodb.getDb().db().collection('users').findOne({ _id: userId });
  if (!user) {
    return res.status(404).send('User not found');
  }

  // Add the book's ID to the user's list of books
  const updatedUser = await mongodb.getDb().db().collection('users').updateOne(
    { _id: userId },
    { $push: { books: bookResult.insertedId } }
  );

  if (!updatedUser.modifiedCount) {
    throw new Error('Failed to update user with new book');
  }

  res.status(200).send({ message: 'Book added successfully', book: newBook });
} catch (error) {
  res.status(500).send({ error: error.message });
}
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
  console.log(allBooks);
  
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
