const Book = require("../models/books");
const User = require("../models/user");

const addBook = async (req, res) => {
  const newBook = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
    createdBy: req.user.userID,
    CN: req.body.CN,
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
  console.log(`${user.userName} added the book ${newBook.title}`);
  res.json(book);
};
const updateBook = async (req, res) => {
  const bookId = req.params.id; // assuming the book ID is passed as a URL parameter
  const updatedFields = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
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
      console.log(`${req.user.name} deleted book ${deletedBook}`);
      res.json(`Removed ${deletedBook.title}`);
    } else {
      throw new Error(`You can not delete someone elses book`);
    }
  }
};
const saveBook = async (req, res) => {
  const bookToSave = {
    CN: req.body.CN,
  };
  const book = await Book.findOne({ CN: bookToSave.CN });
  console.log(book);
  if (!book) {
    throw new Error("Unable to find book");
  }
  const user = await User.findById({ _id: req.user.userID });
  if (!user) {
    throw new Error(
      `Bad Authentication while updating user ${req.user.userID}`
    );
  }
  user.saveBook(book._id, false);
  console.log(`${user.userName} saved ${book.title}`);
  res.json(book);
};
const removeBook = async (req, res) => {
  const bookToRemove = {
    userID: req.user.userID,
    CN: req.body.CN,
  };
  //Get Book
  const book = await Book.findOne({ CN: bookToRemove.CN });
  console.log(book);
  if (!book) {
    throw new Error("Unable to find book");
  }
  //Get user
  const user = await User.findById(bookToRemove.userID);
  console.log(user);
  if (!user) {
    throw new Error("Unable to find user");
  }
  //Check Array
  user.removeBook(book._id);
  //Remove if id is present
  res.json(`Removed ${book._id} from saved favorties of user ${user.username}`);
};
const getOneBook = async (req, res) => {
  const requestData = {
    CN: req.body.CN,
  };
  const book = await Book.findOne({ CN: requestData.CN });
  if (!book) {
    throw new Error("Could not find that book");
  }
  res.json(book);
};
const toggleHeart = async (req, res) => {
  const ids = {
    userID: req.user.userID,
    CN: req.body.CN,
  };

  const book = await Book.findOne({ CN: ids.CN });
  if (!book) {
    throw new Error("Can not find that book");
  }

  const user = await User.findById(ids.userID);
  if (!user) {
    throw new Error("Can not find that user");
  }
  const responseMessage = await user.toggleSaved(book._id);
  res.json(responseMessage);
};

const getAllUserCreated = async (req, res) => {
  const user = await User.findById(req.user.userID);
  if (!user) {
    throw new Error("Incorrect user ID.");
  }
  let counter = 0;
  let books = [];
  let ids = user.createdFavorites
    .map((id) => {
      return id.toString();
    })
    .forEach(async (id, index, idArray) => {
      const book = await getBookId(id);
      books.push(book);
      counter++;
      if (counter === idArray.length) {
        checkOut(books);
      }
    });
  const checkOut = (books) => {
    try {
      if (books) {
        res.status(200).json({ books, count: books.length });
      }
    } catch (error) {
      console.log("Bad Request. get good.");
      throw new Error("Error getting books.");
    }
  };
};
const getAllUserSaved = async (req, res) => {
  const user = await User.findById(req.user.userID);
  if (!user) {
    throw new Error("What are you doing?");
  }
  let counter = 0;
  let books = [];
  let ids = user.savedFavorites
    .map((id) => {
      return id.toString();
    })
    .forEach(async (id, index, idArray) => {
      const book = await getBookId(id);
      books.push(book);
      counter++;
      if (counter === idArray.length) {
        checkOut(books);
      }
    });
  const checkOut = (books) => {
    try {
      if (books) {
        res.status(200).json({ books, count: books.length });
      }
    } catch (error) {
      console.log("failure... Continue?");
      throw new Error("H O W");
    }
  };
};
const getBookId = async (bookId) => {
  const book = await Book.findOne({ _id: bookId });
  if (!book) {
    throw new Error("Could not find book");
  }
  return book;
};

const getAllBooks = async (req, res) => {
  const allBooks = await Book.find();
  res.status(200).json({ allBooks, count: allBooks.length });
};

module.exports = {
  addBook,
  updateBook,
  saveBook,
  removeBook,
  toggleHeart,
  deleteBook,
  getOneBook,
  getAllBooks,
  getAllUserCreated,
  getAllUserSaved,
};
