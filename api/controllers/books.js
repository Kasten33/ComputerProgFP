const Book = require("../models/books");
const User = require("../models/user");
const mongoose = require("mongoose");

const addBook = async (req, res) => {
  try {
   // Create a new book object
   const newBook = {
    title: req.body.title,
    description: req.body.description,
    completed: false,
    chapters: [],
  };

    // Save the new book to the database
    const bookResult = await newBook.save();
    if (!bookResult) {
      throw new Error('Failed to create book');
    }

    // Find the user by their ID
    const userId = req.user._id; // Assuming req.user._id is set by the auth middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Add the book's ID to the user's list of books
    user.books.push(bookResult._id);
    await user.save();

    res.status(200).send({ message: 'Book added successfully', book: bookResult });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id; // assuming the book ID is passed as a URL parameter

    // Validate bookId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send({ error: 'Invalid book ID' });
    }

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
      runValidators: true, // Ensure the update follows the schema validation
    }); // { new: true } option returns the updated document

    if (!book) {
      return res.status(404).send({ error: `No book found with id: ${bookId}` });
    }

    res.status(200).send(book);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const deleteBook = async (req, res) => {
  try {
    const bookId = req.body.id;

    // Validate bookId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send({ error: 'Invalid book ID' });
    }

    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ error: `Could not find book with id: ${bookId}` });
    }

    // Check if the user is authorized to delete the book
    if (book.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'You are not authorized to delete this book' });
    }

    // Delete the book
    const deletedBook = await Book.findByIdAndRemove(bookId);
    if (!deletedBook) {
      return res.status(500).send({ error: 'Deletion unsuccessful' });
    }

    console.log(`${req.user.name} deleted book ${deletedBook.title}`);
    res.status(200).send({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const getOneBook = async (req, res) => {
  try {
    const bookId = req.body._id;

    // Validate bookId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Could not find that book' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBook,
  updateBook,
  deleteBook,
  getOneBook,
  getAllBooks,
};
