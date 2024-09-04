const mongodb = require("../DB/connect");
const { ObjectId } = require("mongodb");

const addBook = async (req, res) => {
  try {
    const book = {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
      chapters: req.body.chapters,
      type: "book",
      userId: req.body.userId,
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection("books")
      .insertOne(book);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(
          response.error || "Error connecting to db while creating book"
        );
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const book = {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection("books")
      .updateOne({ _id: bookId }, { $set: book});
    if (response.acknowledged) {
      res.status(204).json(response);
      console.log("Book updated successfully");
    } else {
      res
        .status(500)
        .json(
          response.error || "Error connecting to db while updating student"
        );
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Validate bookId
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const response = await mongodb
      .getDb()
      .db()
      .collection("books")
      .deleteOne({ _id: new ObjectId(bookId) });

    console.log(response);

    if (response.acknowledged && response.deletedCount > 0) {
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to db', error });
  }
};

const getOneBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Validate bookId
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).send({ error: 'Invalid book ID' });
    }

    const result = await mongodb
      .getDb()
      .db()
      .collection("books")
      .findOne({ _id: new ObjectId(bookId) }); // Convert bookId to ObjectId

    if (!result) {
      return res.status(404).send({ message: 'Book not found' });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the book' });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection("books").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (error) {
    res.status(500).json({ message: "Error connecting to db", error });
  }
};

module.exports = {
  addBook,
  updateBook,
  deleteBook,
  getOneBook,
  getAllBooks,
};
