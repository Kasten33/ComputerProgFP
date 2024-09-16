const mongodb = require("../DB/connect");
const { ObjectId } = require("mongodb");

//Chapters: id | Books:_id | Users:_id

const addBook = async (req, res) => {
  try {
    console.log("User:", req.user);
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const userId = req.user._id;
    console.log("User ID:", userId);

    // Validate userId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await mongodb
      .getDb()
      .db()
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const book = {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
      chapters: req.body.chapters,
      type: "book",
      userId: new ObjectId(userId), // Ensure userId is stored as ObjectId
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection("books")
      .insertOne(book);

    if (response.acknowledged) {
      // Push the book ID to the user's books array
      await mongodb
        .getDb()
        .db()
        .collection("users")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $push: { books: response.insertedId } }
        );
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(response.error || "Error connecting to db while creating book");
    }
  } catch (error) {
    console.error("Error in addBook:", error);
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
      .updateOne({ _id: bookId }, { $set: book });
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
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const response = await mongodb
      .getDb()
      .db()
      .collection("books")
      .deleteOne({ _id: new ObjectId(bookId) });

    const result = await mongodb
      .getDb()
      .db()
      .collection("users")
      .updateOne(
        { books: new ObjectId(bookId) },
        { $pull: { books: new ObjectId(bookId) } }
      );

    console.log(response);
    console.log(result);

    if (
      response.acknowledged &&
      response.deletedCount > 0 &&
      result.acknowledged
    ) {
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error connecting to db", error });
  }
};

const getOneBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Validate bookId
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).send({ error: "Invalid book ID" });
    }

    const result = await mongodb
      .getDb()
      .db()
      .collection("books")
      .findOne({ _id: new ObjectId(bookId) }); // Convert bookId to ObjectId

    if (!result) {
      return res.status(404).send({ message: "Book not found" });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the book" });
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
